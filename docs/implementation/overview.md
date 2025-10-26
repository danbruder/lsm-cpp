# Implementation Overview

This section documents the actual C++ implementation of our LSM tree. As you build each component, this documentation will grow alongside your code.

## Project Status

Current phase: **Planning & Setup**

- [x] Project plan created
- [x] Documentation site initialized
- [ ] Phase 1: Basic write path
- [ ] Phase 2: Basic read path
- [ ] Phase 3: Deletions
- [ ] Phase 4: Compaction
- [ ] Phase 5: Bloom filters
- [ ] Phase 6: Optimizations

## Repository Structure

```
lsm-cpp/
├── src/                    # Source code
│   ├── memtable/          # In-memory buffer
│   │   ├── memtable.h
│   │   └── memtable.cpp
│   ├── wal/               # Write-ahead log
│   │   ├── wal.h
│   │   └── wal.cpp
│   ├── sstable/           # On-disk sorted tables
│   │   ├── sstable.h
│   │   ├── sstable_writer.cpp
│   │   ├── sstable_reader.cpp
│   │   └── sstable_format.h
│   ├── compaction/        # Background merging
│   │   ├── compaction.h
│   │   └── compaction.cpp
│   ├── bloom/             # Bloom filters
│   │   ├── bloom_filter.h
│   │   └── bloom_filter.cpp
│   ├── lsm_tree.h         # Main API
│   └── lsm_tree.cpp
├── tests/                 # Test suite
│   ├── memtable_test.cpp
│   ├── wal_test.cpp
│   ├── sstable_test.cpp
│   ├── compaction_test.cpp
│   └── integration_test.cpp
├── examples/              # Usage examples
│   └── simple_usage.cpp
├── docs/                  # This documentation
├── CMakeLists.txt         # Build configuration
├── LSM_TREE_PLAN.md      # Implementation plan
└── README.md              # Project overview
```

## Component Documentation

As each component is implemented, detailed documentation will be added:

### Core Components
- [MemTable Implementation](/implementation/memtable) - Coming soon
- [WAL Implementation](/implementation/wal) - Coming soon
- [SSTable Implementation](/implementation/sstable) - Coming soon
- [Compaction Implementation](/implementation/compaction) - Coming soon

### Testing & Performance
- [Testing Strategy](/implementation/testing) - Coming soon
- [Benchmarking](/implementation/benchmarking) - Coming soon

## API Design

The high-level API will look like this:

```cpp
#include "lsm_tree.h"

int main() {
    // Initialize LSM tree with data directory
    LSMTree lsm("./data");

    // Put key-value pairs
    lsm.put("user:1:name", "Alice");
    lsm.put("user:1:email", "alice@example.com");
    lsm.put("user:2:name", "Bob");

    // Get values
    auto name = lsm.get("user:1:name");
    if (name) {
        std::cout << "Name: " << *name << std::endl;
    }

    // Delete keys
    lsm.delete_key("user:2:name");

    // Range queries (later phases)
    auto results = lsm.scan("user:1:", "user:2:");
    for (const auto& [key, value] : results) {
        std::cout << key << " = " << value << std::endl;
    }

    return 0;
}
```

## Design Principles

As we implement, we follow these principles:

### 1. Simplicity First
Start with the simplest approach that works:
- Use `std::map` for MemTable initially
- Plain text WAL format (add binary later)
- Simple leveled compaction

### 2. Testability
Every component should be independently testable:
- Unit tests for each class
- Integration tests for interactions
- Benchmarks for performance

### 3. Observability
Add logging and metrics to understand behavior:
```cpp
LOG_INFO("Flushing MemTable: {} entries, {} bytes",
         memtable.size(), memtable.bytes());
LOG_INFO("Compaction started: Level {} -> Level {}",
         from_level, to_level);
```

### 4. Incremental Complexity
Build features step-by-step:
1. Get writes working
2. Then reads
3. Then deletions
4. Then compaction
5. Then optimizations

### 5. Modern C++
Use C++17/20 features appropriately:
- `std::optional` for nullable returns
- `std::filesystem` for file operations
- `std::span` for array views
- Smart pointers for memory management

## File Formats

### WAL Format
```
Entry:
┌──────────┬──────────┬─────────┬─────────┬────────┐
│ Key Size │ Val Size │ Key     │ Value   │ CRC32  │
│ 4 bytes  │ 4 bytes  │ var     │ var     │ 4 bytes│
└──────────┴──────────┴─────────┴─────────┴────────┘
```

### SSTable Format
```
File Layout:
┌────────────────┐
│  Data Block 1  │  ← Sorted key-value pairs
├────────────────┤
│  Data Block 2  │
├────────────────┤
│      ...       │
├────────────────┤
│  Index Block   │  ← Sparse index: [key, offset] pairs
├────────────────┤
│  Bloom Filter  │  ← Optional (Phase 5)
├────────────────┤
│     Footer     │  ← Metadata (48 bytes, fixed)
└────────────────┘

Footer (48 bytes):
- Index offset:        8 bytes
- Index size:          8 bytes
- Bloom filter offset: 8 bytes
- Bloom filter size:   8 bytes
- Number of entries:   8 bytes
- Magic number:        8 bytes (0x4C534D5353544142)
```

## Build System

Using CMake for cross-platform builds:

```cmake
cmake_minimum_required(VERSION 3.15)
project(lsm-tree-cpp VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler warnings
add_compile_options(-Wall -Wextra -Wpedantic)

# Main library
add_library(lsm_tree STATIC
    src/memtable/memtable.cpp
    src/wal/wal.cpp
    src/sstable/sstable_writer.cpp
    src/sstable/sstable_reader.cpp
    src/compaction/compaction.cpp
)

# Tests (using Google Test)
find_package(GTest REQUIRED)
enable_testing()
add_subdirectory(tests)

# Examples
add_subdirectory(examples)
```

## Development Workflow

1. **Write tests first** (TDD approach)
2. **Implement minimal code** to pass tests
3. **Document as you go** in this site
4. **Benchmark periodically** to understand performance
5. **Refactor** when you understand the problem better

## Metrics to Track

As we build, we'll track these metrics:

### Write Performance
- Keys per second
- Throughput (MB/s)
- Latency (p50, p99)

### Read Performance
- Lookups per second
- Latency distribution
- Cache hit rate

### Space Usage
- Space amplification (disk / logical data)
- Compression ratio
- SSTable sizes per level

### Compaction
- Compaction frequency
- Write amplification
- I/O during compaction

## Next Steps

Ready to start implementing? Begin with:

1. [Set up the development environment](/guide/prerequisites)
2. [Create the project structure](/guide/setup)
3. [Implement Phase 1: Write Path](/guide/phase1-write)

As you implement each component, come back and document your learnings here!
