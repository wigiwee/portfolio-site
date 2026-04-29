<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpRight, Code2, GitBranch, Github, Star } from 'lucide-vue-next'

const GITHUB_PROFILE_URL = 'https://github.com/wigiwee'
const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/wigiwee/'
const GITHUB_REPOS_ENDPOINT = '/api/github/repos'
const GITHUB_EVENTS_ENDPOINT = '/api/github/events'
const LEETCODE_ENDPOINT = '/api/leetcode'

const repos = ref([])
const events = ref([])
const leetcode = ref(null)
const isLoading = ref(true)
const hasGitHubError = ref(false)
const hasLeetCodeError = ref(false)

const fallbackRepos = [
  {
    name: 'portfolio-site',
    html_url: 'https://github.com/wigiwee/portfolio-site',
    language: 'Vue',
    forks_count: 0,
    stargazers_count: 0,
    updated_at: '2026-04-29T14:29:30Z',
  },
  {
    name: 'mesh-vpn-system',
    html_url: 'https://github.com/wigiwee/mesh-vpn-system',
    language: 'Go',
    forks_count: 0,
    stargazers_count: 0,
    updated_at: '2026-04-17T07:34:00Z',
  },
  {
    name: 'mini-projects',
    html_url: 'https://github.com/wigiwee/mini-projects',
    language: 'Java',
    forks_count: 0,
    stargazers_count: 1,
    updated_at: '2026-04-15T17:07:35Z',
  },
]

const fallbackLeetCode = {
  matchedUser: {
    username: 'wigiwee',
    profile: {
      ranking: 4489756,
      starRating: 0.5,
    },
    submitStatsGlobal: {
      acSubmissionNum: [
        { difficulty: 'All', count: 19, submissions: 38 },
        { difficulty: 'Easy', count: 9, submissions: 25 },
        { difficulty: 'Medium', count: 9, submissions: 11 },
        { difficulty: 'Hard', count: 1, submissions: 2 },
      ],
    },
  },
  recentAcSubmissionList: [
    { id: '1990988975', title: 'Reverse Words in a String', titleSlug: 'reverse-words-in-a-string', timestamp: '1777463639' },
    { id: '1990982176', title: 'Reverse Vowels of a String', titleSlug: 'reverse-vowels-of-a-string', timestamp: '1777462817' },
    { id: '1990968452', title: 'Can Place Flowers', titleSlug: 'can-place-flowers', timestamp: '1777461215' },
  ],
}

const displayRepos = computed(() => (repos.value.length ? repos.value : fallbackRepos).slice(0, 3))

const displayEvents = computed(() => events.value.slice(0, 4).map((event) => ({
  id: event.id,
  label: formatEventType(event.type),
  title: event.repo?.name?.replace('wigiwee/', '') ?? 'repository',
  href: `https://github.com/${event.repo?.name ?? 'wigiwee'}`,
  time: formatRelativeTime(event.created_at),
})))

const leetcodeData = computed(() => leetcode.value ?? fallbackLeetCode)
const leetcodeUser = computed(() => leetcodeData.value.matchedUser)
const leetcodeStats = computed(() => {
  const stats = leetcodeUser.value?.submitStatsGlobal?.acSubmissionNum ?? []
  return Object.fromEntries(stats.map((item) => [item.difficulty.toLowerCase(), item]))
})

const leetcodeSubmissions = computed(() => leetcodeData.value.recentAcSubmissionList ?? [])
const totalStars = computed(() => displayRepos.value.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0))
const primaryLanguageCount = computed(() => new Set(displayRepos.value.map((repo) => repo.language).filter(Boolean)).size)

const formatEventType = (type) => {
  const eventLabels = {
    CreateEvent: 'Created',
    DeleteEvent: 'Deleted',
    ForkEvent: 'Forked',
    IssuesEvent: 'Issue',
    PullRequestEvent: 'Pull request',
    PublicEvent: 'Published',
    PushEvent: 'Pushed',
    ReleaseEvent: 'Released',
    WatchEvent: 'Starred',
  }

  return eventLabels[type] ?? type?.replace('Event', '') ?? 'Updated'
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'recently'

  const diffSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [unit, seconds] of units) {
    const value = Math.floor(diffSeconds / seconds)
    if (value >= 1) return `${value} ${unit}${value === 1 ? '' : 's'} ago`
  }

  return 'just now'
}

const formatLeetCodeTime = (timestamp) => {
  const seconds = Number(timestamp)
  if (!Number.isFinite(seconds)) return 'recently'
  return formatRelativeTime(new Date(seconds * 1000).toISOString())
}

const formatNumber = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return new Intl.NumberFormat('en').format(number)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Recently'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const fetchGitHubActivity = async () => {
  try {
    const [reposResponse, eventsResponse] = await Promise.all([
      fetch(GITHUB_REPOS_ENDPOINT, { headers: { Accept: 'application/json' } }),
      fetch(GITHUB_EVENTS_ENDPOINT, { headers: { Accept: 'application/json' } }),
    ])

    if (!reposResponse.ok || !eventsResponse.ok) {
      throw new Error('GitHub request failed')
    }

    const [repoData, eventData] = await Promise.all([
      reposResponse.json(),
      eventsResponse.json(),
    ])

    repos.value = Array.isArray(repoData) ? repoData.filter((repo) => !repo.fork) : []
    events.value = Array.isArray(eventData)
      ? eventData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : []
  } catch {
    hasGitHubError.value = true
  }
}

const fetchLeetCodeStats = async () => {
  try {
    const response = await fetch(LEETCODE_ENDPOINT, { headers: { Accept: 'application/json' } })

    if (!response.ok) {
      throw new Error('LeetCode request failed')
    }

    const payload = await response.json()
    leetcode.value = payload?.data ?? payload
  } catch {
    hasLeetCodeError.value = true
  }
}

onMounted(async () => {
  await Promise.allSettled([
    fetchGitHubActivity(),
    fetchLeetCodeStats(),
  ])
  isLoading.value = false
})
</script>

<template>
  <section id="activity" class="section-container">
    <div class="section-heading">
      <h2 class="section-title">activity.</h2>
      <div class="profile-actions">
        <a :href="GITHUB_PROFILE_URL" target="_blank" rel="noopener noreferrer" class="profile-link">
          <Github class="profile-icon" />
          GitHub
          <ArrowUpRight class="profile-icon" />
        </a>
        <a :href="LEETCODE_PROFILE_URL" target="_blank" rel="noopener noreferrer" class="profile-link">
          <Code2 class="profile-icon" />
          LeetCode
          <ArrowUpRight class="profile-icon" />
        </a>
      </div>
    </div>

    <div class="activity-grid" :class="{ 'is-loading': isLoading }">
      <div class="activity-panel github-panel">
        <div class="panel-header">
          <span class="panel-kicker">GitHub</span>
          <span class="panel-status">{{ hasGitHubError ? 'Cached' : 'Live' }}</span>
        </div>

        <div class="stat-grid">
          <div class="stat-block">
            <span class="stat-value">{{ displayRepos.length }}</span>
            <span class="stat-label">recent repos</span>
          </div>
          <div class="stat-block">
            <span class="stat-value">{{ primaryLanguageCount }}</span>
            <span class="stat-label">languages</span>
          </div>
          <div class="stat-block">
            <span class="stat-value">{{ totalStars }}</span>
            <span class="stat-label">stars</span>
          </div>
        </div>

        <div class="repo-list">
          <a
            v-for="repo in displayRepos"
            :key="repo.name"
            :href="repo.html_url"
            target="_blank"
            rel="noopener noreferrer"
            class="repo-card"
          >
            <span class="item-title">{{ repo.name }}</span>
            <span class="item-meta">
              <span>{{ repo.language || 'Code' }}</span>
              <span class="inline-stat"><Star class="mini-icon" />{{ repo.stargazers_count ?? 0 }}</span>
              <span class="inline-stat"><GitBranch class="mini-icon" />{{ repo.forks_count ?? 0 }}</span>
              <span>{{ formatDate(repo.updated_at) }}</span>
            </span>
          </a>
        </div>

        <div class="event-list">
          <a
            v-for="event in displayEvents"
            :key="event.id"
            :href="event.href"
            target="_blank"
            rel="noopener noreferrer"
            class="activity-item"
          >
            <span class="event-type">{{ event.label }}</span>
            <span class="item-title">{{ event.title }}</span>
            <span class="item-meta">{{ event.time }}</span>
          </a>

          <span v-if="!displayEvents.length" class="activity-item muted">
            {{ hasGitHubError ? 'GitHub unavailable' : 'Loading GitHub activity' }}
          </span>
        </div>
      </div>

      <div class="activity-panel leetcode-panel">
        <div class="panel-header">
          <span class="panel-kicker">LeetCode</span>
          <span class="panel-status">{{ hasLeetCodeError ? 'Cached' : 'Live' }}</span>
        </div>

        <div class="stat-grid leetcode-stats">
          <div class="stat-block">
            <span class="stat-value">{{ leetcodeStats.all?.count ?? 0 }}</span>
            <span class="stat-label">solved</span>
          </div>
          <div class="stat-block">
            <span class="stat-value">{{ formatNumber(leetcodeUser?.profile?.ranking) }}</span>
            <span class="stat-label">rank</span>
          </div>
          <div class="stat-block">
            <span class="stat-value">{{ leetcodeUser?.profile?.starRating ?? 0 }}</span>
            <span class="stat-label">rating</span>
          </div>
        </div>

        <div class="difficulty-grid">
          <div class="difficulty-card easy">
            <span class="difficulty-count">{{ leetcodeStats.easy?.count ?? 0 }}</span>
            <span class="difficulty-label">Easy</span>
          </div>
          <div class="difficulty-card medium">
            <span class="difficulty-count">{{ leetcodeStats.medium?.count ?? 0 }}</span>
            <span class="difficulty-label">Medium</span>
          </div>
          <div class="difficulty-card hard">
            <span class="difficulty-count">{{ leetcodeStats.hard?.count ?? 0 }}</span>
            <span class="difficulty-label">Hard</span>
          </div>
        </div>

        <div class="submission-list">
          <a
            v-for="submission in leetcodeSubmissions"
            :key="submission.id"
            :href="`https://leetcode.com/problems/${submission.titleSlug}/`"
            target="_blank"
            rel="noopener noreferrer"
            class="activity-item"
          >
            <span class="event-type">Accepted</span>
            <span class="item-title">{{ submission.title }}</span>
            <span class="item-meta">{{ formatLeetCodeTime(submission.timestamp) }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container {
  padding: 5rem 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  border-bottom: var(--border-width) solid var(--border-color);
  margin-bottom: 3rem;
  padding-bottom: 1rem;
}

.section-heading .section-title {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: var(--border-width) solid var(--border-color);
  color: var(--text-color);
  font-family: var(--font-mono);
  font-weight: 900;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow: 4px 4px 0px var(--border-color);
}

.profile-link:hover,
.repo-card:hover,
.activity-item:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-color);
  background: var(--text-color);
  color: var(--bg-color);
}

.profile-icon,
.mini-icon {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.activity-panel {
  border: var(--border-width) solid var(--border-color);
  box-shadow: 8px 8px 0px var(--border-color);
  padding: 1.25rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: var(--border-width) solid var(--border-color);
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
}

.panel-kicker {
  font-family: var(--font-display);
  font-size: 1.5rem;
  text-transform: uppercase;
}

.panel-status {
  border: 2px solid var(--border-color);
  font-family: var(--font-mono);
  font-weight: 900;
  padding: 0.25rem 0.6rem;
  text-transform: uppercase;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-block {
  border: var(--border-width) solid var(--border-color);
  padding: 1rem;
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1;
  overflow-wrap: anywhere;
}

.stat-label {
  display: block;
  margin-top: 0.4rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
}

.repo-list,
.event-list,
.submission-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.event-list,
.submission-list {
  margin-top: 1.25rem;
}

.repo-card,
.activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  text-decoration: none;
  box-shadow: 4px 4px 0px var(--border-color);
  transition: all 0.1s;
}

.item-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
}

.inline-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.event-type {
  width: fit-content;
  background: var(--text-color);
  color: var(--bg-color);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.2rem 0.45rem;
  text-transform: uppercase;
}

.repo-card:hover .item-meta,
.activity-item:hover .item-meta {
  color: var(--bg-color);
}

.activity-item:hover .event-type {
  background: var(--bg-color);
  color: var(--text-color);
}

.activity-item.muted {
  color: var(--text-muted);
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.difficulty-card {
  border: var(--border-width) solid var(--border-color);
  padding: 1rem;
}

.difficulty-count {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
}

.difficulty-label {
  display: block;
  margin-top: 0.4rem;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
}

.easy {
  border-left: 8px solid #18c964;
}

.medium {
  border-left: 8px solid #f5a524;
}

.hard {
  border-left: 8px solid #f31260;
}

@media (max-width: 1000px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .section-heading {
    flex-direction: column;
  }

  .profile-actions,
  .profile-link {
    width: 100%;
  }

  .profile-link {
    justify-content: center;
  }

  .stat-grid,
  .difficulty-grid {
    grid-template-columns: 1fr;
  }
}
</style>
