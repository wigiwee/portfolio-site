<script setup>
import { ChevronRight } from 'lucide-vue-next'
</script>

<template>
  <section id="work" class="section-container">
    <h2 class="section-title">work.</h2>
    
    <div class="work-card">
      <div class="timeline-line"></div>
      <div class="timeline-dot"></div>
      
      <div class="work-content">
        <img src="@/assets/tl.png" alt="Infosys" class="company-logo" />
        
        <h3 class="job-title">Tinkerer's Lab Manager</h3>
        <p class="job-meta">Tinkerer's Lab PREC</p>
        
        <ul class="job-details">
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Managed end-to-end operations of the Tinkerers’ Lab, ensuring smooth daily functioning.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Maintained and supervised advanced fabrication tools including 3D printers and CO₂ laser cutters.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Led and mentored a student technical team supporting projects and lab activities.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Designed and enforced safety protocols, usage guidelines, and access policies.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Implemented inventory tracking systems to ensure accountability and efficient resource usage.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Conducted hands-on training sessions for students on machines and fabrication workflows.</span>
          </li>
          <li class="detail-item">
            <ChevronRight class="detail-icon" />
            <span>Coordinated workshops, hackathons, and interdisciplinary technical events.</span>
          </li>
        </ul>
      </div>
    </div>

    <a 
      href="https://makerbhavanfoundation.org/programs/tinkerers-lab/our-labs" 
      target="_blank"
      class="read-more-link"
    >
      Read More →
    </a>
  </section>
</template>

<style scoped>
.section-container {
  padding: 5rem 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.work-card {
  position: relative;
  padding: 2rem;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  box-shadow: 8px 8px 0px var(--border-color);
  transition: all 0.1s;
}

.work-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0px var(--border-color);
}

.timeline-line,
.timeline-dot {
  display: none;
}

.company-logo {
  height: 4rem;
  width: auto;
  margin-bottom: 2rem;
  filter: grayscale(100%) contrast(1.2);
}

/* Invert logo in light mode if it's a white logo */
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
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: -1px;
}

.work-card:hover .job-title {
  color: var(--text-color);
  text-decoration: underline;
  text-decoration-thickness: 3px;
}

.job-meta {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1rem;
  border-bottom: 2px solid var(--text-muted);
  display: inline-block;
  padding-bottom: 0.25rem;
}

.job-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--text-color);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.detail-item span {
  font-size: 1.125rem;
  line-height: 1.6;
  font-family: var(--font-mono);
}

.detail-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-color);
  flex-shrink: 0;
  margin-top: 0.25rem;
  background: var(--text-color);
  color: var(--bg-color);
  padding: 2px;
}

.read-more-link {
  display: inline-block;
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--text-color);
  text-decoration: none;
  padding: 1rem 2rem;
  border: var(--border-width) solid var(--border-color);
  box-shadow: 6px 6px 0px var(--border-color);
  transition: all 0.1s;
}

.read-more-link:hover {
  background: var(--text-color);
  color: var(--bg-color);
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px var(--border-color);
}

.read-more-link:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px var(--border-color);
}
</style>
