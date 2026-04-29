<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronRight, Github } from 'lucide-vue-next'

const baseProjects = [
  {
    title: "Virtual Private Mesh Network Solution",
    tech: "Go • Pion/ice • Wireguard",
    link: "https://github.com/wigiwee/mesh-vpn-system",
    details: [
      "Developed a peer-to-peer VPN backend handling connection orchestration, authentication, and routing.",
      "Implemented secure client-server public-private key exchange for encrypted peer communication.",
      "Enabled NAT traversal using STUN & ICE to establish direct peer-to-peer connectivity.",
      "Designed relay fallback (DERP-like) servers for reliable communication when direct connections fail.",
      "Achieved up to 1.2 Gbps throughput with 17 ms latency on same-LAN peers; 122 Mbps with 227 ms latency across",
      "different networks; and 21 Mbps with 435 ms latency in relay mode (tested with up to 4 peers network)",
      "Integrated WireGuard-based tunneling for high-performance, secure, and reliable data transfer",
    ]
  },
  {
    title: "CargoStacks – Laboratory Inventory Management Solution",
    tech: "Java • Spring Boot • MySQL",
    link: "https://github.com/wigiwee/CargoStacks",
    details: [
      "Designed and developed a scalable inventory management system to track 5k+ assets across multiple categories.",
      "Built RESTful APIs with simulated workloads of 27k req/hr while maintaining low-latency responses.",
      "Modeled complex relational schemas in MySQL, optimizing queries data retrieval time by 25% during testing.",
      "Implemented role-based access control with secure authentication, supporting 3+ user roles & access levels.",
      "Added validation & centralized exception handling, reducing system errors by 30% in controlled test scenarios.",
    ]
  },
  {
    title: "LabMate-AI – Academic Laboratory Assistant",
    tech: "Java • Spring AI • PgVector DB • Ollama-LLM",
    link: "https://github.com/wigiwee/LabMate-AI",
    details: [
      "Built an AI-driven laboratory assistant to answer context-aware queries using Retrieval-Augmented Generation.",
      "Implemented Spring AI backend to orchestrate document ingestion, embedding generation, & query handling.",
      "Integrated LLM-based reasoning with vector similarity search, achieving 85%+ response accuracy on domain-specific queries.",
      "Reduced average query resolution time from 5 minutes to under 10 seconds for lab-related information retrieval.",
      "Designed a scalable embedding pipeline using PostgreSQL (pgvector), handling 10k+ document chunks with sub-second retrieval latency.",
      "Implemented response token streaming to significantly improve perceived latency & enhance user experience.",
      "Improved onboarding efficiency for new lab members by 50% by enabling instant access to structured knowledge & documentation.",
    ]
  },
  {
    title: "Self-Hosted Infrastructure & DevOps Lab",
    tech: "Proxmox • Docker • Ansible • Bash Scripting • Automation",
    link: "https://github.com/wigiwee/awesomely-selfhosted",
    details: [
      "Deployed and managed 10+ self-hosted services using Docker and Docker Compose, ensuring modular and reproducible environments",
      "Automated provisioning with Ansible, reducing setup time and manual configuration effort by ~40–50%",
      "Configured Nginx reverse proxy with domain-based routing and SSL, enabling secure multi-service access",
      "Integrated Cloudflare DNS proxy and HTTPS, improving security and reducing direct server exposure",
      "Maintained ~99% uptime through service monitoring, restart policies, and network-level troubleshooting",
      "Implemented persistent storage, backups, and volume management, ensuring zero critical data loss",
      "Optimized network configurations (ports, firewall, routing), improving service reliability and access consistency",
      "Deployed real-world tools (dashboards, monitoring, dev services), improving workflow efficiency and system usability",
    ]
  }
]

const current = ref(0)
let interval

const startAutoSlide = () => {
  if (interval) return
  interval = setInterval(() => {
    current.value = (current.value + 1) % baseProjects.length
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
  <section id="projects" class="section-container">
    <h2 class="section-title">projects.</h2>

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
          v-for="(proj, index) in baseProjects" 
          :key="index" 
          class="slide"
        >
          <div class="project-card">
            <h3 class="project-title">{{ proj.title }}</h3>
            <p class="project-tech">{{ proj.tech }}</p>

            <ul class="project-details">
              <li v-for="(d, i) in proj.details" :key="i" class="detail-item">
                <ChevronRight class="detail-icon" />
                <span>{{ d }}</span>
              </li>
            </ul>

            <div class="project-actions">
              <a :href="proj.link" target="_blank" rel="noopener noreferrer" class="github-btn">
                <Github class="github-icon" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="current = (current - 1 + baseProjects.length) % baseProjects.length">
        ← Prev
      </button>
      <button @click="current = (current + 1) % baseProjects.length">
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
}

.slider-track {
  display: flex;
  transition: transform 0.6s linear; /* smooth continuous */
}

.slide {
  min-width: 100%;
  display: flex;
}

.project-card {
  padding: 2rem;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  box-shadow: 8px 8px 0px var(--border-color);

  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.project-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0px var(--border-color);
}

.project-title {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-display);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.project-tech {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid var(--text-muted);
  width: 100%;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex-grow: 1;
}

.detail-item {
  display: flex;
  gap: 1rem;
}

.detail-item span {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  line-height: 1.6;
}

.detail-icon {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--text-color);
  color: var(--bg-color);
  padding: 2px;
}

.project-actions {
  margin-top: auto;
}

.github-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.9rem;

  padding: 0.75rem 1.5rem;

  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  text-decoration: none;

  box-shadow: 4px 4px 0px var(--border-color);
  transition: all 0.1s ease;
}

.github-btn:hover {
  background: var(--text-color);
  color: var(--bg-color);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-color);
}

.github-icon {
  width: 1.2rem;
  height: 1.2rem;
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
  font-size: 0.9rem;

  padding: 0.75rem 1.5rem;

  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);

  box-shadow: 4px 4px 0px var(--border-color);
  transition: all 0.1s ease;
}

.controls button:hover {
  background: var(--text-color);
  color: var(--bg-color);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-color);
}

.controls button:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px var(--border-color);
}
</style>
