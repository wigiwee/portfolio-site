<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const baseExperiences = [
  {
    title: "Tinkerer's Lab Manager",
    org: "Tinkerer's Lab PREC",
    logo: new URL('@/assets/tl.png', import.meta.url).href,
    duration: "Academic year 2025 to 2026",
    details: [
      "Managed Tinkerers’ Lab operations serving 150+ active students/month, ensuring high uptime and efficient workflows",
      "Maintained and optimized 3 3D printers, achieving ~45% operational uptime",
      "Led a 10–15 member student technical team, improving project turnaround time by 40%",
      "Conducted 25+ hands-on workshops on 3D printing, CAD & laser cutting, training 300+ students",
      "Established safety protocols and SOPs, reducing equipment misuse incidents by 50%",
      "Implemented inventory tracking, cutting material wastage by 20% and improving resource allocation",
      "Organized 2 hackathons and interdisciplinary events with 100+ participants, boosting lab engagement and collaboration"
    ]
  },
  {
    title: "Web Developer Intern",
    org: "Exaltasoft Solutions, Pune",
    logo: new URL('@/assets/exaltasoft.png', import.meta.url).href,
    duration: "Jan 2025 - Feb 2025",
    details: [
      "Delivered 3+ client-facing web applications for hotels and B2B clients, ensuring production-ready deployment",
      "Increased platform traffic 3× (5k → 15k requests/month) through UI revamp and API optimization",
      "Improved user engagement and session duration by ~30% via responsive, SEO-optimized interfaces",
      "Built scalable REST APIs with Express.js, supporting efficient and reliable data handling",
      "Reduced average response time by ~20% using optimized MongoDB queries and indexing",
      "Enhanced overall system performance and usability, leading to improved client satisfaction and retention"
    ]
  },
  {
    title: "IT Manager",
    org: "TCS ion",
    logo: new URL('@/assets/tcsion.png', import.meta.url).href,
    duration: "GATE 2024 & GATE 2025",
    details: [
      "Selected for a paid contract based technical operations role for GATE 2024 & 2025 examinations",
      "Set up and managed 150+ systems, ensuring secure, stable, and isolated exam environments",
      "Reduced system downtime/lock periods by ~30% through real-time issue diagnosis and resolution",
      "Supported 1000+ candidate workflows, ensuring smooth onboarding and registration processes",
      "Maintained high system reliability by adhering strictly to operational and security protocols",
      "Collaborated with TCS iON and on-site teams, ensuring zero major disruptions during exam execution",
    ]
  }
]

const current = ref(0)
let interval

const startAutoSlide = () => {
  if (interval) return
  interval = setInterval(() => {
    current.value = (current.value + 1) % baseExperiences.length
  }, 5000)
}

const stopAutoSlide = () => {
  clearInterval(interval)
  interval = null
}

onMounted(startAutoSlide)
onUnmounted(stopAutoSlide)
</script>

<template>
  <section id="work" class="section-container">
    <h2 class="section-title">work.</h2>

    <div 
      class="slider"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
    >
      <div 
        class="slider-track"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div 
          v-for="(exp, index) in baseExperiences" 
          :key="index" 
          class="slide"
        >
          <div class="work-card">
            <div class="card-top">
              <img :src="exp.logo" :alt="`${exp.org} logo`" class="company-logo" />

              <h3 class="job-title">{{ exp.title }}</h3>

              <div class="job-meta">
                <span class="org">{{ exp.org }}</span>
                <span class="duration">{{ exp.duration }}</span>
              </div>
            </div>

            <ul class="job-details">
              <li v-for="(d, i) in exp.details" :key="i" class="detail-item">
                <ChevronRight class="detail-icon" />
                <span>{{ d }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="current = (current - 1 + baseExperiences.length) % baseExperiences.length">
        ← Prev
      </button>
      <button @click="current = (current + 1) % baseExperiences.length">
        Next →
      </button>
    </div>
  </section>
</template>

<style scoped>
.section-container {
  padding: 5rem 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.slider {
  overflow: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  transition: transform 0.6s linear;
}

.slide {
  min-width: 100%;
  display: flex;
  padding: 0 14px 14px 0;
}

.work-card {
  position: relative;
  width: 100%;
  padding: 2rem;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  box-shadow: 8px 8px 0px var(--border-color);
  transition: transform 0.1s, box-shadow 0.1s;
}

.work-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0px var(--border-color);
}

.card-top {
  display: flex;
  flex-direction: column;
}

.company-logo {
  height: 4rem;
  margin-bottom: 2rem;
  align-self: flex-start;
  filter: grayscale(100%) contrast(1.2);
}

:root.light .company-logo {
  filter: grayscale(100%) invert(1);
}

.work-card:hover .company-logo {
  filter: grayscale(0%) contrast(1);
}

:root.light .work-card:hover .company-logo {
  filter: grayscale(0%) invert(1);
}

.job-title {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-display);
  text-transform: uppercase;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  border-bottom: 2px solid var(--text-muted);
}

.duration {
  opacity: 0.7;
}

.job-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
}

.detail-item span {
  font-family: var(--font-mono);
}

.detail-icon {
  background: var(--text-color);
  color: var(--bg-color);
  padding: 2px;
}

.controls {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.controls button {
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border: var(--border-width) solid var(--border-color);
  box-shadow: 4px 4px 0px var(--border-color);
}

.controls button:hover {
  transform: translate(2px, 2px);
}

.read-more-link {
  margin-top: 2rem;
  display: inline-block;
  padding: 1rem 2rem;
  border: var(--border-width) solid var(--border-color);
  box-shadow: 6px 6px 0px var(--border-color);
}
.read-more-link {
  margin-top: 2rem;
  display: inline-block;
  padding: 1rem 2rem;
  border: var(--border-width) solid var(--border-color);
  box-shadow: 6px 6px 0px var(--border-color);

  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.read-more-link:hover {
  transform: translate(2px, 2px);
}
</style>
