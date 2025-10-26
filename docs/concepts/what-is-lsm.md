# What is an LSM Tree?

A **Log-Structured Merge Tree (LSM tree)** is a data structure optimized for **write-intensive workloads**. It achieves high write throughput by transforming random writes into sequential writes, then merging data in the background.

## The Problem: Random Writes Are Slow

Traditional databases using B-trees perform **in-place updates**:

```
1. Search for the key in the tree (random read)
2. Read the page containing the key (random read)
3. Modify the value
4. Write the page back (random write)
```

This involves **random I/O**, which is slow:
- **HDD**: ~100 IOPS (I/O operations per second)
- **SSD**: ~10,000 IOPS

Even with SSDs, random writes cause **write amplification** and wear.

## The LSM Solution: Sequential Writes

LSM trees use a fundamentally different approach:

```
1. Write to in-memory buffer (MemTable) - Fast!
2. Append to write-ahead log (WAL) - Sequential write
3. When buffer is full, flush to disk as sorted file (SSTable)
4. Periodically merge files in background (Compaction)
```

Sequential writes are **much faster**:
- **HDD**: ~100 MB/s (vs 1 MB/s for random)
- **SSD**: ~500+ MB/s (vs 50 MB/s for random)

## Architecture Overview

Here's the high-level structure of an LSM tree:

```
┌─────────────────────────────────────────────┐
│                 LSM Tree                     │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐      ┌──────────────┐    │
│  │  MemTable    │─────→│     WAL      │    │
│  │  (In-memory) │      │ (Append-only)│    │
│  └──────┬───────┘      └──────────────┘    │
│         │ Flush when full                   │
│         ↓                                    │
│  ┌──────────────────────────────────────┐  │
│  │         Level 0 (SSTables)           │  │
│  │  [SST1] [SST2] [SST3] [SST4]        │  │
│  └────────┬─────────────────────────────┘  │
│           │ Compaction                      │
│           ↓                                  │
│  ┌──────────────────────────────────────┐  │
│  │         Level 1 (SSTables)           │  │
│  │  [SST5─────] [SST6─────] [SST7────] │  │
│  └────────┬─────────────────────────────┘  │
│           │ Compaction                      │
│           ↓                                  │
│  ┌──────────────────────────────────────┐  │
│  │         Level 2+ (SSTables)          │  │
│  │  [SST8─────────────] [SST9────────] │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Key Components

### 1. MemTable
- In-memory sorted data structure (usually skip list or red-black tree)
- Receives all writes
- Typically 4-64 MB in size
- Fast: O(log n) reads and writes

### 2. Write-Ahead Log (WAL)
- Append-only file on disk
- Ensures durability: can recover MemTable after crash
- Deleted after MemTable is flushed

### 3. SSTable (Sorted String Table)
- **Immutable** sorted file on disk
- Contains key-value pairs in sorted order
- Includes index for fast lookups
- Often includes Bloom filter

### 4. Compaction
- Background process that merges SSTables
- Removes deleted entries (tombstones)
- Removes old versions of updated keys
- Maintains read performance

## How Writes Work

```cpp
// Simplified write path
void LSMTree::put(string key, string value) {
    // 1. Write to WAL for durability
    wal.append(key, value);

    // 2. Write to MemTable
    memtable.put(key, value);

    // 3. Check if MemTable is full
    if (memtable.is_full()) {
        // Flush to disk as new SSTable
        flush_memtable_to_sstable();

        // Maybe trigger compaction
        if (should_compact()) {
            compact();
        }
    }
}
```

**Time complexity**: O(log n) for MemTable insert
**I/O**: One sequential append to WAL

## How Reads Work

```cpp
// Simplified read path
optional<string> LSMTree::get(string key) {
    // 1. Check MemTable first (newest data)
    if (auto val = memtable.get(key)) {
        return val;
    }

    // 2. Check SSTables from newest to oldest
    for (auto& sstable : sstables) {
        // Check Bloom filter first (if exists)
        if (!sstable.bloom_filter.might_contain(key)) {
            continue; // Definitely not in this SSTable
        }

        // Search SSTable
        if (auto val = sstable.get(key)) {
            return val;
        }
    }

    return nullopt; // Not found
}
```

**Time complexity**: O(log n) per SSTable
**I/O**: Up to k disk reads (where k = number of SSTables)

This is why **compaction** is crucial - it keeps the number of SSTables manageable.

## Why "Log-Structured Merge"?

The name describes the core operations:

- **Log-Structured**: Writes are appended to a log (sequential)
- **Merge**: Multiple logs are periodically merged together
- **Tree**: Data is organized in levels (tree structure)

## Real-World Examples

### LevelDB
- Created by Google (Jeff Dean and Sanjay Ghemawat)
- Used in Chrome, Bitcoin Core, and more
- Simple, clean implementation (~10,000 lines)

### RocksDB
- Fork of LevelDB by Meta (Facebook)
- Highly optimized for SSD
- Used in MySQL, MongoDB, CockroachDB

### Apache Cassandra
- Uses LSM trees for storage
- Adds distributed coordination on top

## Trade-offs

LSM trees aren't perfect for everything. Understanding trade-offs is crucial:

| Aspect | LSM Trees | B-Trees |
|--------|-----------|---------|
| Writes | ✅ Very fast (sequential) | ❌ Slower (random) |
| Reads | ⚠️ Can be slow (multiple levels) | ✅ Fast (one lookup) |
| Space | ⚠️ Higher (duplicates before compaction) | ✅ Compact |
| Compaction | ⚠️ Background CPU/I/O cost | ✅ None needed |

We'll explore these trade-offs in detail in [Trade-offs](/concepts/tradeoffs).

## When to Use LSM Trees

LSM trees excel when you have:

- **Write-heavy workloads** (logging, time-series, event streams)
- **Append-mostly data** (write once, read many times)
- **Large datasets** that don't fit in memory
- **Sequential access patterns** (range queries)

They're less ideal for:

- **Read-heavy workloads with random access**
- **Frequent updates to same keys**
- **Latency-sensitive single reads** (B-trees are more consistent)

## Next Steps

Now that you understand what an LSM tree is, dive deeper:

- [Why LSM Trees?](/concepts/why-lsm) - Detailed motivation and history
- [Trade-offs](/concepts/tradeoffs) - When to use (and not use) LSM trees
- [MemTable](/concepts/memtable) - Deep dive into the in-memory component

Ready to build? Start with [Phase 1: Write Path](/guide/phase1-write)!
