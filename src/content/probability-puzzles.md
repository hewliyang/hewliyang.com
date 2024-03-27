---
title: Probability Puzzles
date: '2024-3-16'
description: For keeping the mind fresh / interview prep
published: true
---

The following are a collection of interview-esque questions I see in the wild and think are valuable for practice on the fundamentals for data science & quant roles. The solutions are moderately verbose on purpose to include many talking points for discussion.

## I have a totally fair 7-sided die. I roll the die 523 times. What's the expected number of times that the sequence 3-2-5-7-4 will show up?

Firstly, we note that each roll of the dice is independent and uniform. So we can compute the probability of this singular event happening as:

$P(3-2-5-7-4) = (1/7)^5$

Secondly, we note that in 523 rows, the sequence can only start in 519 positions because the length of itself is 5.

We denote the event that sequence starts at position $i \in [1, 519]$ as $X_i$

$$
X_i = \begin{cases}
	1 & \text{if sequence starts at position } i \\
	0 & \text{otherwise}
\end{cases}
$$

We have $E(X_i) = p_i \cdot 1 + (1 - p_i) \cdot 0 = p_i$ because sequence either starts at position $i$ or does not

For clarity, let's also denote the event $Y$ as the number of occurences of the sequence. Then, the expected value of occurences is

$$
Y = X_1 + X_2 + ... + X_{519} = \sum_{i=1}^{519}X_i
$$

$$
\begin{align*}
E(Y) &= E\left(\sum_{i=1}^{519}X_i\right) \\
&= \sum_{i=1}^{519}E(X_i) && \text{linearity of expectation} \\
&= 519 \cdot E(X_i) \\
&= 519 \cdot p_i \\
&= 519 \cdot \left(\frac{1}{7}\right)^5
\end{align*}
$$

Finally, it is worth to also note that the $X_i$'s are in fact **not** independent. For example, if $X_1 = 1$ then we know that $X_2, X_3, X_4, X_5 = 0$ and so on.
