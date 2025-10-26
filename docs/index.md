---
layout: home

hero:
  name: LSM Tree Learning
  text: Build a Database Storage Engine
  tagline: A hands-on journey building a Log-Structured Merge Tree in C++
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: What is an LSM Tree?
      link: /concepts/what-is-lsm
    - theme: alt
      text: View on GitHub
      link: https://github.com/danbruder/lsm-cpp

features:
  - icon: 📚
    title: Learn by Building
    details: Understand how modern databases like LevelDB, RocksDB, and Cassandra work by implementing your own LSM tree from scratch.

  - icon: 🎯
    title: Optimized for Learning
    details: Code clarity over performance. Incremental phases with detailed explanations at every step.

  - icon: 🔍
    title: Deep Understanding
    details: Explore write paths, read paths, compaction strategies, and the trade-offs that make LSM trees powerful.

  - icon: 🛠️
    title: Modern C++
    details: Learn modern C++17/20 features while building a real-world data structure.

  - icon: ⚡
    title: Step-by-Step Phases
    details: Six incremental phases from basic writes to advanced optimizations with Bloom filters and caching.

  - icon: 🧪
    title: Test-Driven
    details: Comprehensive testing strategy with unit tests, integration tests, and benchmarks.
---

## Why LSM Trees?

LSM trees power some of the world's most important databases. They're the secret behind:

- **Google's LevelDB** and Bigtable
- **Meta's RocksDB** (used in MySQL, MongoDB, and more)
- **Apache Cassandra** and HBase
- **CockroachDB** and many others

Unlike traditional B-trees, LSM trees optimize for **write performance** by deferring the cost of maintaining sorted data:

```
Write Path:  Memory → Sequential Log → Background Merge
             ↓         ↓                ↓
             Fast!     Fast!            Amortized
```

## What You'll Build

Over 6 phases, you'll implement:

1. **MemTable & WAL** - In-memory buffer with crash recovery
2. **SSTables** - Sorted on-disk storage with efficient reads
3. **Deletions** - Tombstones and removal logic
4. **Compaction** - Background merging to reclaim space
5. **Bloom Filters** - Skip unnecessary disk reads
6. **Optimizations** - Caching, multi-level compaction, and more

## Learning Approach

This isn't just code - it's a **learning journey** where you'll:

- Read foundational papers (O'Neil et al. 1996)
- Study production implementations (LevelDB)
- Understand trade-offs (write vs read vs space amplification)
- Benchmark and profile your implementation
- Document your insights for others

## Quick Start

```bash
# Clone the repository
git clone https://github.com/danbruder/lsm-cpp.git
cd lsm-cpp

# Read the plan
cat LSM_TREE_PLAN.md

# Start with the guide
npm run docs:dev
```

## Documentation Structure

- **Guide** - Step-by-step implementation phases
- **Concepts** - Deep dives into LSM tree theory
- **Implementation** - Detailed code walkthroughs and architecture

Ready to dive in? Start with the [Introduction](/guide/introduction)!
