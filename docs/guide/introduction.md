# Introduction

Welcome to the LSM Tree Learning Project! This guide will walk you through building a Log-Structured Merge (LSM) tree in C++ from the ground up.

## What You'll Learn

By the end of this project, you'll deeply understand:

- **How modern databases work** - The storage engine is the heart of any database
- **LSM tree architecture** - Why it's used in LevelDB, RocksDB, Cassandra, and more
- **Trade-offs in storage systems** - Write vs read vs space amplification
- **Systems programming in C++** - File I/O, data structures, and performance optimization
- **Testing complex systems** - Unit tests, integration tests, and benchmarks

## Why Build an LSM Tree?

LSM trees are everywhere in modern infrastructure:

- **LevelDB** (Google) - Powers Chrome's IndexedDB
- **RocksDB** (Meta) - Storage engine for MySQL, MongoDB, CockroachDB
- **Apache Cassandra** - Wide-column NoSQL database
- **HBase** - Hadoop database
- **InfluxDB** - Time-series database

Understanding LSM trees gives you insight into how these systems achieve **high write throughput** and **efficient storage**.

## The Core Idea

Traditional databases (B-trees) update data in-place:

```
Write Request → Find Page on Disk → Update → Write Back
                      ↓
                   Slow! (Random I/O)
```

LSM trees take a different approach:

```
Write Request → Append to Memory → Eventually Merge to Disk
                      ↓                      ↓
                   Fast!               Amortized Cost
```

The key insight: **Sequential writes are much faster than random writes**, especially on HDDs but also on SSDs.

## Learning Philosophy

This project is **optimized for learning**, not production use. That means:

### ✅ We Prioritize

- **Clarity** - Code should be easy to read and understand
- **Incremental complexity** - Build up features step-by-step
- **Observable behavior** - Logging and visualization of what's happening
- **Testing** - Verify each component works correctly
- **Documentation** - Explain the "why" behind design decisions

### ❌ We Don't Worry About (Yet)

- Production-level performance optimization
- Concurrent/multi-threaded operations
- Distributed systems concerns
- Advanced compression algorithms

You can add these later once you understand the fundamentals!

## Project Timeline

**Estimated time**: 6-8 weeks (10 hours/week)

The implementation is divided into 6 phases:

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Write Path (MemTable, WAL, SSTable write) | 1-2 weeks |
| 2 | Read Path (SSTable read, recovery) | 1 week |
| 3 | Deletions (Tombstones) | 1 week |
| 4 | Compaction (Merge SSTables) | 1-2 weeks |
| 5 | Bloom Filters (Optimize reads) | 1 week |
| 6 | Optimizations (Caching, tuning) | 1+ weeks |

## Prerequisites

Before starting, you should have:

- **C++ knowledge** - Comfortable with classes, templates, STL
- **Basic systems knowledge** - File I/O, memory management
- **Build tools** - CMake, a C++17+ compiler
- **Testing frameworks** - Google Test (we'll set this up)

::: tip Don't worry if you're rusty!
We'll explain concepts as we go and link to resources for deeper learning.
:::

## How to Use This Guide

1. **Read the concepts** - Start with [What is an LSM Tree?](/concepts/what-is-lsm)
2. **Follow the phases** - Implement each phase in order
3. **Test as you go** - Write tests for each component
4. **Document your journey** - Keep notes on what you learn
5. **Experiment** - Try different approaches and optimizations

## Additional Resources

As you work through the project, refer to:

- **Papers**
  - ["The Log-Structured Merge-Tree"](https://www.cs.umb.edu/~poneil/lsmtree.pdf) - O'Neil et al. (1996)
  - ["Bigtable: A Distributed Storage System"](https://research.google/pubs/pub27898/) - Google (2006)

- **Books**
  - "Database Internals" by Alex Petrov (Chapter 7)
  - "Designing Data-Intensive Applications" by Martin Kleppmann

- **Code**
  - [LevelDB source](https://github.com/google/leveldb) - Clean, well-commented
  - [RocksDB wiki](https://github.com/facebook/rocksdb/wiki) - Extensive documentation

## Next Steps

Ready to start? Here's your path:

1. [Prerequisites](/guide/prerequisites) - Set up your development environment
2. [Project Setup](/guide/setup) - Initialize the C++ project structure
3. [Phase 1: Write Path](/guide/phase1-write) - Implement your first writes!

Let's build something amazing! 🚀
