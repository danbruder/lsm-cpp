# LSM Tree Learning Project

A learning-focused implementation of a Log-Structured Merge (LSM) tree in modern C++.

## What is this?

This project implements an LSM tree from scratch, optimized for educational purposes rather than production use. It's designed to help understand the fundamental concepts behind modern database storage engines like LevelDB, RocksDB, and Apache Cassandra.

## Why LSM Trees?

LSM trees are the backbone of many modern databases because they:
- Provide extremely fast writes (sequential I/O)
- Scale well for write-heavy workloads
- Offer good read performance with optimizations (Bloom filters, caching)
- Are simpler than B-trees for certain use cases

### The Core Idea

Instead of updating data in-place (like B-trees), LSM trees:
1. **Write** new data sequentially to memory and disk (fast!)
2. **Merge** old and new data in the background (compaction)
3. **Read** by checking recent data first, then older data

This defers the cost of maintaining sorted structures, making writes much faster.

## Project Goals

- **Learn by doing**: Understand LSM trees through implementation
- **Clear code**: Prioritize readability over performance
- **Incremental**: Build complexity step-by-step
- **Modern C++**: Use C++17/20 features appropriately
- **Well-tested**: Comprehensive unit and integration tests

## Documentation

📚 **[Full Documentation Site](https://lsm-tree-learning.netlify.app)** (Coming Soon)

This project includes comprehensive documentation built with VitePress, covering:
- Step-by-step implementation guides
- Deep dives into LSM tree concepts
- Code architecture and design decisions
- Performance benchmarks and analysis

### Run Documentation Locally

```bash
# Install dependencies
npm install

# Start documentation dev server
npm run docs:dev
```

Visit `http://localhost:5173` to browse the docs.

## Quick Start

### Prerequisites

- C++17 or later compiler
- CMake 3.15+
- Google Test (optional, for tests)
- Node.js 18+ (for documentation)

### Building (Coming Soon)

```bash
mkdir build && cd build
cmake ..
make
```

### Usage Example (Coming Soon)

```cpp
#include "lsm_tree.h"

int main() {
    LSMTree lsm("./data");

    // Write
    lsm.put("key1", "value1");
    lsm.put("key2", "value2");

    // Read
    auto value = lsm.get("key1");
    if (value) {
        std::cout << *value << std::endl;
    }

    // Delete
    lsm.delete_key("key2");

    return 0;
}
```

## Project Structure

- **LSM_TREE_PLAN.md** - Comprehensive implementation plan
- **src/** - Source code (components built incrementally)
- **tests/** - Unit and integration tests
- **examples/** - Usage examples
- **docs/** - Additional documentation

## Implementation Phases

1. **Phase 1**: Basic write path (MemTable, WAL, SSTable write)
2. **Phase 2**: Basic read path (SSTable read, recovery)
3. **Phase 3**: Deletions and tombstones
4. **Phase 4**: Compaction
5. **Phase 5**: Bloom filters
6. **Phase 6**: Optimizations

See [LSM_TREE_PLAN.md](LSM_TREE_PLAN.md) for detailed implementation plan.

## Key Components

### MemTable
In-memory buffer for fast writes. Flushed to disk when full.

### Write-Ahead Log (WAL)
Ensures durability. Allows recovery after crashes.

### SSTable (Sorted String Table)
Immutable on-disk files containing sorted key-value pairs.

### Compaction
Background process that merges SSTables to reclaim space and maintain performance.

### Bloom Filter
Probabilistic data structure to avoid unnecessary disk reads.

## Learning Resources

- **Paper**: "The Log-Structured Merge-Tree (LSM-Tree)" by O'Neil et al. (1996)
- **Code**: LevelDB implementation (https://github.com/google/leveldb)
- **Book**: "Database Internals" by Alex Petrov, Chapter 7
- **Article**: "LSM Trees and B-Trees" comparison

## Development Status

🚧 **Work in Progress** - Currently in planning phase

- [x] Project plan created
- [ ] Phase 1: Basic write path
- [ ] Phase 2: Basic read path
- [ ] Phase 3: Deletions
- [ ] Phase 4: Compaction
- [ ] Phase 5: Bloom filters
- [ ] Phase 6: Optimizations

## Contributing

This is a personal learning project, but suggestions and discussions are welcome! Feel free to open issues or discussions.

## License

MIT License - feel free to use this for learning purposes.

## Acknowledgments

Inspired by:
- LevelDB (Google)
- RocksDB (Meta)
- "Database Internals" by Alex Petrov
- Various LSM tree papers and blog posts

---

**Note**: This is an educational project. For production use, consider:
- [LevelDB](https://github.com/google/leveldb) - Simple and stable
- [RocksDB](https://github.com/facebook/rocksdb) - High performance, feature-rich
- [WiredTiger](https://github.com/wiredtiger/wiredtiger) - MongoDB's storage engine
