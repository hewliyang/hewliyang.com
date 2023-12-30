---
title: First post
description: First post.
date: '2023-4-14'
published: true
---

## Markdown

Hey friends! 👋

```ts
function greet(name: string) {
	console.log(`Hey ${name}! 👋`)
}
```

This is a list:

1. Apple
2. Banana
3. Pineapple

This is an unordered list:

- one
- two
- three

---

```python
from typing import Dict, Self
from langchain.llm import BaseLLM


class LLM(BaseLLM):
	"""
	Base class for OpenAI LLMs
	"""

	def __init__(self, **kwargs: Dict[str, str]) -> Self:
		super().__init__(self, **kwargs)

	def foo(self) -> None:
		return NotImplementedError()
	
	def bar(self) -> None:
		return NotImplementedError()
```

> This component will be deprecated in `v2`