## Initial Architecture

We'll start with one endpoint where we send a fixed package.

Query
```
{
  "url": "...",
  "selection": "...",
  "user_understanding": 
  {
    "subject_name": int_level,
    ...
  },
}
```

Response
```
{
  "explanation": "...",
  "suggested_queries": [""],
  "suggested_viewpoints": ["software engineer", "", ...],
  "topic_tags": ["science", "distributed_systems"]
}
```

Server should be entirely stateless. Let's see how this does.
