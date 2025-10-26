import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LSM Tree Learning',
  description: 'Building a Log-Structured Merge Tree in C++ - A Learning Journey',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Concepts', link: '/concepts/what-is-lsm' },
      { text: 'Implementation', link: '/implementation/overview' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Prerequisites', link: '/guide/prerequisites' },
            { text: 'Project Setup', link: '/guide/setup' }
          ]
        },
        {
          text: 'Learning Path',
          items: [
            { text: 'Phase 1: Write Path', link: '/guide/phase1-write' },
            { text: 'Phase 2: Read Path', link: '/guide/phase2-read' },
            { text: 'Phase 3: Deletions', link: '/guide/phase3-deletions' },
            { text: 'Phase 4: Compaction', link: '/guide/phase4-compaction' },
            { text: 'Phase 5: Bloom Filters', link: '/guide/phase5-bloom' },
            { text: 'Phase 6: Optimizations', link: '/guide/phase6-optimizations' }
          ]
        }
      ],
      '/concepts/': [
        {
          text: 'Core Concepts',
          items: [
            { text: 'What is an LSM Tree?', link: '/concepts/what-is-lsm' },
            { text: 'Why LSM Trees?', link: '/concepts/why-lsm' },
            { text: 'Trade-offs', link: '/concepts/tradeoffs' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'MemTable', link: '/concepts/memtable' },
            { text: 'Write-Ahead Log', link: '/concepts/wal' },
            { text: 'SSTables', link: '/concepts/sstable' },
            { text: 'Compaction', link: '/concepts/compaction' },
            { text: 'Bloom Filters', link: '/concepts/bloom-filter' }
          ]
        },
        {
          text: 'Deep Dives',
          items: [
            { text: 'Write Amplification', link: '/concepts/write-amplification' },
            { text: 'Read Amplification', link: '/concepts/read-amplification' },
            { text: 'Space Amplification', link: '/concepts/space-amplification' }
          ]
        }
      ],
      '/implementation/': [
        {
          text: 'Implementation Guide',
          items: [
            { text: 'Overview', link: '/implementation/overview' },
            { text: 'Architecture', link: '/implementation/architecture' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'MemTable Implementation', link: '/implementation/memtable' },
            { text: 'WAL Implementation', link: '/implementation/wal' },
            { text: 'SSTable Implementation', link: '/implementation/sstable' },
            { text: 'Compaction Implementation', link: '/implementation/compaction' }
          ]
        },
        {
          text: 'Testing & Benchmarks',
          items: [
            { text: 'Testing Strategy', link: '/implementation/testing' },
            { text: 'Benchmarking', link: '/implementation/benchmarking' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/danbruder/lsm-cpp' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'MIT Licensed | Learning Project'
    },

    search: {
      provider: 'local'
    }
  },
  

  // Markdown configuration for better code highlighting
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
