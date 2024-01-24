---
title: Traffic Detection on Singaporean Highways
date: '2022-11-29'
description: Leveraging computer vision and the Land Transport Authority's traffic camera feed to automate traffic detection, prediction & analytics.
published: true
---

In this post, I'd like to some details about a real time traffic detection system my team and I built as part of a [DSA3101: Data Science in Practice](https://nusmods.com/courses/DSA3101/data-science-in-practice) class project.

### Preamble

We were given the following resources to work with:

1. 200$ in credits for provisioning AWS EC2 VM's and S3 buckets
2. API key to access real time motorway surveillance images from the [LTA](https://www.lta.gov.sg/content/ltagov/en.html)

Here is a sample from the Ayer Rajah Expressway (AYE) from After Tuas West Road:

![lta-sample](../../lta-cam.jpg)

### Cleaning

As you see in the image above, typically there is only one camera captures traffic in both directions. We need to split this into 2 images in order to obtain meaningful estimates (imagine one side is full, while the other is empty. a combined count cannot capture this!).

To achieve this, we built a annotation tool with `opencv` to produce the cropping boundaries for each camera (87 in total) by hand.

![](https://raw.githubusercontent.com/hewliyang/st1131-qrcodes/64e053db1e5c5ee79a3e79030add1cfab4b6ade7/crop.svg)

Given a `camera_id`, we do a look-up for the cropping coordinates, and perform the crop producing a `left` and `right` image.

### Object Detection and Counting

We found that small, pre-trained object detectors like **YOLO**, which were trained on the [`COCO`](https://cocodataset.org/#home) dataset worked fine for the task.

In the end, we opted for a lightweight combination of **YOLOX** at the following settings:

```python
import os
from yolox.exp import Exp as MyExp

class Exp(MyExp):
  def __init__(self):
    super(Exp, self).__init__()
    self.depth = 0.33
    self.width = 0.375
    self.input_size = (416, 416)
    self.mosaic_scale = (0.5, 1.5)
    self.random_size = (10, 20)
    self.test_size = (416, 416)
    self.exp_name = os.path.split(os.path.realpath(__file__))[1].split(".")[0]
    self.enable_mixup = False
```

augmented with [Slice Aided Hyper Inferencing](https://arxiv.org/abs/2202.06934) for small object detection. The resulting detections were satisfactory in the day time, but poor in the night or during bad weather conditions.

![yolo-detections](https://raw.githubusercontent.com/hewliyang/dsa3101-2210-14-lta/main/backend/assets/sample_1709.png)

### Storage & Deployment

Our entire setup was efficient enough to be deployed on a small-ish machine **(??)** (4GB memory, 2 vCPU), so we loaded it into a EC2 instance, setup `cron` to run a script that would perform inference every 10 minutes and push the results to a **MongoDB** database.

We stored both our own ephemeral copies of images in order to keep the frontend in sync with our backend. This was due to the lack of GPU compute causing each batch of inference to be slower than 5 minutes, which is the lifetime of an image before revalidation by the LTA's **CDN**.

As a sanity check to ensure that our system was actually working, we plotted a time-series of traffic density against time over a 24 hour window.

![time series plot](../../traffic-time-series.png)

### REST API

We set up a bunch of `GET` endpoints as an abstraction layer for our frontend team to seamlessly pull in the latest data easily.

- `api/image/[camera_id]`: URL to latest image in S3 bucket
- `api/record/[camera_id]`: Latest metadata (traffic density, etc) of image
- `api/history/[camera_id]`: List of metadata for the past 24-hour window

### Conclusion

On to some NUS specific stuff, I had fun taking this class. It was a refreshing deviation from the dry, theoretical exam-only classes that unfortunately form the majority of my course.

This class wasn't really about training/improving models but instead integrating them into real life applications in a full stack context, as well as gaining an appreciation for `docker-compose` for containerization and `git` for version control.

![docker](https://pbs.twimg.com/media/FPKqqiFX0AMRBu4?format=png&name=small)

For more details on how we ended up estimating traffic density and more, do refer to the publicly available source code on [GitHub](https://github.com/hewliyang/dsa3101-2210-14-lta)
