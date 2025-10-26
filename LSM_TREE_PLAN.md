# LSM Tree Learning Project - Implementation Plan

## 1. Project Overview

This document outlines a plan to build a **Log-Structured Merge Tree (LSM Tree)** in C++ optimized for educational purposes. The implementation prioritizes clarity, incremental learning, and understanding of core concepts over production-grade performance.

### What is an LSM Tree?

An LSM tree is a data structure optimized for write-heavy workloads. It's used in databases like:
- LevelDB (Google)
- RocksDB (Meta)
- Cassandra
- HBase

**Key Insight**: LSM trees defer the cost of maintaining sorted data by:
1. Writing data sequentially (fast!)
2. Periodically merging and sorting in the background (compaction)

---

## 2. Design Goals (Learning-Optimized)

### Primary Goals
1. **Clarity over performance** - Easy-to-understand code with extensive comments
2. **Incremental complexity** - Build features step-by-step
3. **Observable behavior** - Add logging and visualization of internal operations
4. **Testability** - Each component should be independently testable
5. **Modern C++ practices** - Use C++17/20 features appropriately

### Non-Goals (For Initial Version)
- Production-level performance optimization
- Distributed/concurrent operations
- Advanced compression algorithms
- Multi-threaded compaction (add later)

---

## 3. Core Components

### 3.1 MemTable (In-Memory Buffer)
**Purpose**: Fast writes go here first

**Implementation**:
- Use `std::map<std::string, std::string>` initially (simple, sorted)
- Later: Consider skip list for educational purposes
- Size limit: Flush to disk when threshold reached (e.g., 4MB)

**Operations**:
- `put(key, value)` - Insert/update
- `get(key)` - Retrieve value
- `delete(key)` - Tombstone marker
- `flush()` - Write to SSTable when full

### 3.2 Write-Ahead Log (WAL)
**Purpose**: Durability - recover MemTable after crash

**Implementation**:
- Simple append-only file
- Format: `[timestamp][key_size][value_size][key][value]\n`
- One WAL per active MemTable
- Delete WAL after successful flush to SSTable

**Operations**:
- `append(key, value)` - Add entry
- `recover()` - Rebuild MemTable from WAL

### 3.3 SSTable (Sorted String Table)
**Purpose**: Immutable, sorted on-disk storage

**Structure**:
```
[Data Block 1]
[Data Block 2]
...
[Data Block N]
[Index Block]  <- Points to data blocks
[Footer]       <- Metadata (index location, version, etc.)
```

**File Format**:
- **Data Blocks**: Sorted key-value pairs
- **Index Block**: Sparse index (key -> offset in file)
- **Footer**: Fixed size, contains index offset

**Implementation Details**:
- File naming: `{level}_{sequence}.sst`
- Each SSTable is immutable once written
- Use memory-mapped files for reading (later optimization)

### 3.4 Compaction Process
**Purpose**: Merge SSTables to maintain efficiency

**Strategy** (Leveled Compaction - simplified):
- **Level 0**: Overlapping SSTables (direct MemTable flushes)
- **Level 1+**: Non-overlapping SSTables
- Trigger: When level size exceeds threshold
- Process: Merge SSTables, remove duplicates/tombstones

**Compaction Algorithm**:
1. Select SSTables from Level N
2. Merge-sort keys from selected SSTables
3. Apply deletions (tombstones)
4. Keep latest value for duplicate keys
5. Write new SSTables to Level N+1
6. Delete old SSTables

### 3.5 Bloom Filter (Optional but Recommended)
**Purpose**: Avoid expensive disk reads for non-existent keys

**Implementation**:
- One Bloom filter per SSTable
- Store in SSTable footer or separate file
- Use multiple hash functions (e.g., 3-5)
- False positive rate: ~1%

---

## 4. Implementation Phases

### Phase 1: Basic Write Path (Week 1-2)
**Goal**: Write data and persist it

**Tasks**:
1. Implement MemTable (using `std::map`)
2. Implement basic WAL (append-only log)
3. Implement SSTable writer
   - Simple format: serialized key-value pairs
   - Basic index: array of (key, offset) pairs
4. MemTable flush logic
5. Basic CLI for testing

**Deliverable**: Can write key-value pairs and flush to disk

**Test**:
```cpp
lsm.put("key1", "value1");
lsm.put("key2", "value2");
// Trigger flush
// Verify SSTable file exists and contains data
```

### Phase 2: Basic Read Path (Week 2-3)
**Goal**: Read data back

**Tasks**:
1. Implement MemTable lookup
2. Implement SSTable reader
   - Read index
   - Binary search index for key
   - Read data block
3. Implement read path:
   - Check MemTable first
   - Then check SSTables (newest to oldest)
4. Recovery from WAL on startup

**Deliverable**: Can read previously written data

**Test**:
```cpp
lsm.put("key1", "value1");
lsm.flush();
lsm.restart(); // Simulate crash and recovery
assert(lsm.get("key1") == "value1");
```

### Phase 3: Deletions and Tombstones (Week 3)
**Goal**: Support delete operations

**Tasks**:
1. Add tombstone marker (special value or flag)
2. Update write path to handle deletions
3. Update read path to check for tombstones
4. Ensure tombstones propagate through compaction

**Deliverable**: Can delete keys

**Test**:
```cpp
lsm.put("key1", "value1");
lsm.delete("key1");
assert(lsm.get("key1") == std::nullopt);
```

### Phase 4: Simple Compaction (Week 4-5)
**Goal**: Merge SSTables to reclaim space

**Tasks**:
1. Implement 2-way SSTable merge
   - Merge sort algorithm
   - Handle tombstones (remove old entries)
   - Handle duplicates (keep newest)
2. Simple leveling strategy:
   - Level 0: All MemTable flushes
   - Level 1: Compacted SSTables
3. Trigger compaction when Level 0 has N files (e.g., 4)
4. Add compaction logging/stats

**Deliverable**: Automatic background compaction

**Test**:
```cpp
// Write many keys to trigger multiple flushes
for (int i = 0; i < 10000; i++) {
    lsm.put("key" + std::to_string(i), "value" + std::to_string(i));
}
// Verify compaction occurred
// Verify data is still readable
```

### Phase 5: Bloom Filters (Week 5-6)
**Goal**: Optimize reads for non-existent keys

**Tasks**:
1. Implement Bloom filter class
2. Build Bloom filter during SSTable write
3. Store Bloom filter in SSTable
4. Check Bloom filter before reading SSTable
5. Measure performance improvement

**Deliverable**: Faster negative lookups

**Test**:
```cpp
// Measure time to lookup 1000 non-existent keys
// With and without Bloom filters
// Should see significant improvement
```

### Phase 6: Optimizations and Refinements (Week 6+)
**Goal**: Make it faster and more robust

**Tasks**:
1. Add block cache for frequently accessed data
2. Implement proper leveled compaction (multiple levels)
3. Add range queries (`scan(start_key, end_key)`)
4. Add statistics and monitoring
5. Multi-threaded compaction
6. Memory-mapped file I/O

**Deliverable**: More complete LSM tree implementation

---

## 5. File Structure

```
lsm-cpp/
├── src/
│   ├── memtable/
│   │   ├── memtable.h
│   │   └── memtable.cpp
│   ├── wal/
│   │   ├── wal.h
│   │   └── wal.cpp
│   ├── sstable/
│   │   ├── sstable.h
│   │   ├── sstable_writer.cpp
│   │   ├── sstable_reader.cpp
│   │   └── sstable_format.h
│   ├── compaction/
│   │   ├── compaction.h
│   │   └── compaction.cpp
│   ├── bloom/
│   │   ├── bloom_filter.h
│   │   └── bloom_filter.cpp
│   ├── lsm_tree.h
│   └── lsm_tree.cpp
├── tests/
│   ├── memtable_test.cpp
│   ├── wal_test.cpp
│   ├── sstable_test.cpp
│   ├── compaction_test.cpp
│   └── integration_test.cpp
├── examples/
│   └── simple_usage.cpp
├── docs/
│   └── architecture.md
├── CMakeLists.txt
└── README.md
```

---

## 6. Key Algorithms

### 6.1 Write Path
```
1. Append to WAL
2. Insert into MemTable
3. If MemTable > threshold:
   a. Create new MemTable
   b. Flush old MemTable to SSTable (Level 0)
   c. Delete WAL
   d. Check if compaction needed
```

### 6.2 Read Path
```
1. Check MemTable
2. If not found, check each SSTable (newest first):
   a. Check Bloom filter (if exists)
   b. Binary search SSTable index
   c. Read data block
   d. Return if found
3. Return "not found"
```

### 6.3 Compaction (Simplified Leveled)
```
1. Select SSTables from Level N (all if N=0)
2. Find overlapping SSTables in Level N+1
3. Merge-sort all selected SSTables:
   a. Use priority queue (min-heap) on current key
   b. For duplicate keys, keep newest version
   c. Skip tombstones for deleted keys (if old enough)
4. Write new SSTables to Level N+1
5. Delete old SSTables
```

---

## 7. Data Structures

### 7.1 MemTable
```cpp
class MemTable {
private:
    std::map<std::string, std::string> data_;
    size_t size_bytes_;
    const size_t max_size_;

public:
    void put(const std::string& key, const std::string& value);
    std::optional<std::string> get(const std::string& key);
    void flush_to_sstable(SSTableWriter& writer);
    size_t size() const { return size_bytes_; }
    bool is_full() const { return size_bytes_ >= max_size_; }
};
```

### 7.2 SSTable Format
```
SSTable File Layout:
+------------------+
| Data Block 1     |  <- Key-value pairs (sorted)
+------------------+
| Data Block 2     |
+------------------+
| ...              |
+------------------+
| Index Block      |  <- Sparse index: [key, offset] pairs
+------------------+
| Bloom Filter     |  <- Bloom filter data (optional)
+------------------+
| Footer           |  <- Metadata (fixed 48 bytes)
+------------------+

Footer Format (48 bytes):
- Index offset (8 bytes)
- Index size (8 bytes)
- Bloom filter offset (8 bytes)
- Bloom filter size (8 bytes)
- Num entries (8 bytes)
- Magic number (8 bytes): 0x4C534D5353544142 ("LSMSSTAB")
```

### 7.3 WAL Format
```
WAL Entry:
+----------+----------+----------+-----+-------+
| Key Size | Val Size | Key Bytes| Val | CRC32 |
| (4 bytes)| (4 bytes)| (var)    |(var)| (4 b) |
+----------+----------+----------+-----+-------+
```

---

## 8. Testing Strategy

### Unit Tests
- MemTable: insert, lookup, flush
- WAL: write, recovery
- SSTable: write, read, binary search
- Bloom filter: false positive rate
- Compaction: merge logic

### Integration Tests
- Write → Flush → Read
- Write → Crash → Recover → Read
- Write → Compact → Read
- Concurrent reads during compaction

### Benchmarks
- Write throughput (keys/sec)
- Read latency (µs)
- Space amplification (disk usage / logical data size)
- Compaction overhead

---

## 9. Learning Resources

### Papers
1. **"The Log-Structured Merge-Tree (LSM-Tree)"** - O'Neil et al., 1996
   - Original LSM tree paper

2. **"Bigtable: A Distributed Storage System"** - Google, 2006
   - Describes Bigtable's use of LSM trees

3. **"LevelDB Implementation Notes"**
   - https://github.com/google/leveldb/blob/main/doc/impl.md

### Books
- "Database Internals" by Alex Petrov (Chapter 7)
- "Designing Data-Intensive Applications" by Martin Kleppmann

### Codebases to Study
- LevelDB (C++): Simple and clean implementation
- RocksDB (C++): Production-grade, highly optimized
- WiscKey (paper): Separates keys and values

---

## 10. Potential Extensions (Post-Learning)

1. **Concurrent Operations**
   - Reader-writer locks
   - Lock-free MemTable (skip list)

2. **Advanced Compaction**
   - Size-tiered compaction
   - Time-window compaction
   - Universal compaction

3. **Value Separation**
   - Store large values separately (like WiscKey)
   - Reduce write amplification

4. **Snapshots**
   - Point-in-time consistent views
   - MVCC (Multi-Version Concurrency Control)

5. **Compression**
   - Snappy/LZ4 compression for SSTables
   - Block-level compression

6. **Distributed Version**
   - Replication
   - Partitioning/sharding

---

## 11. Success Metrics

By the end of this project, you should be able to:

1. **Explain** why LSM trees are faster for writes than B-trees
2. **Implement** the core write and read paths
3. **Understand** trade-offs: write amplification vs read amplification vs space amplification
4. **Benchmark** and profile your implementation
5. **Compare** your design decisions with LevelDB/RocksDB
6. **Extend** with your own optimizations

---

## 12. Development Environment

### Required Tools
- C++17 or later compiler (GCC 9+, Clang 10+, or MSVC 2019+)
- CMake 3.15+
- Google Test (for unit tests)
- Google Benchmark (for performance tests)

### Recommended Tools
- Valgrind (memory leak detection)
- GDB/LLDB (debugging)
- Perf (Linux profiling)
- Clang-tidy (static analysis)
- Clang-format (code formatting)

### Build System (CMake)
```cmake
cmake_minimum_required(VERSION 3.15)
project(lsm-tree-cpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add compiler warnings
add_compile_options(-Wall -Wextra -Wpedantic)

# Dependencies
find_package(GTest REQUIRED)

# Main library
add_library(lsm_tree STATIC
    src/memtable/memtable.cpp
    src/wal/wal.cpp
    src/sstable/sstable_writer.cpp
    src/sstable/sstable_reader.cpp
    src/compaction/compaction.cpp
)

# Tests
enable_testing()
add_subdirectory(tests)

# Examples
add_subdirectory(examples)
```

---

## 13. Timeline Estimate

**Total Time**: 6-8 weeks (part-time, ~10 hours/week)

- Week 1-2: Write path (MemTable, WAL, SSTable write)
- Week 2-3: Read path (SSTable read, recovery)
- Week 3: Deletions and tombstones
- Week 4-5: Compaction
- Week 5-6: Bloom filters
- Week 6+: Optimizations and experimentation

**Note**: This is a learning project, so take time to:
- Read papers and documentation
- Experiment with different approaches
- Write comprehensive tests
- Profile and understand performance

---

## Next Steps

1. Set up development environment
2. Create CMake build system
3. Implement Phase 1 (Basic Write Path)
4. Write tests as you go
5. Document design decisions
6. Iterate and refine

Happy learning!
