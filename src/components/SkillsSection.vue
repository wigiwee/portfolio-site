<script setup>
import { ref } from 'vue'

const skills = [
  { name: 'Java', icon: 'java.png', category: 'language' },
  { name: 'Go', icon: 'go.svg', category: 'language' },
  { name: 'Bash', icon: 'bash.png', category: 'language' },
  { name: 'Maven', icon: 'maven.png', category: 'tool' },
  { name: 'Linux', icon: 'Linux-Dark.png', category: 'core' },
  { name: 'Git & GitHub', icon: 'Github-Dark.svg', category: 'tool' },
  { name: 'Neovim', icon: 'neovim.png', category: 'tool' },
  { name: 'ansible', icon: 'ansible.png', category: 'tool' },
  { name: 'Postman', icon: 'postman.png', category: 'tool' },
  { name: 'VSCodium', icon: 'codium.svg', category: 'tool' },
  { name: 'Arch', icon: 'arch.png', category: 'core' },
  { name: 'MySQL', icon: 'mysql.png', category: 'core' },
  { name: 'mongo', icon: 'mongo.png', category: 'core' },
  { name: 'NGINX', icon: 'nginx.png', category: 'core' },
  { name: 'Ubuntu Server', icon: 'ubuntu.png', category: 'core' },
  { name: 'Docker', icon: 'docker.png', category: 'tool' },
]

const getImageUrl = (name) => {
  if (!name) return null
  return new URL(`../assets/${name}`, import.meta.url).href
}

// Random float animation duration for each item
const getAnimationDelay = (index) => {
  return `${index * 0.2}s`
}

const getAnimationDuration = (index) => {
  return `${3 + (index % 3)}s`
}
</script>

<template>
  <section id="tools" class="section-container">
    <h2 class="section-title">Tools.</h2>
    
    <div class="skills-playground">
      <div 
        v-for="(skill, index) in skills" 
        :key="skill.name"
        class="skill-bubble"
        :class="skill.category"
        :style="{ 
          animationDelay: getAnimationDelay(index),
          animationDuration: getAnimationDuration(index)
        }"
      >
      
        <div class="bubble-content">
          <img 
            v-if="skill.icon"
            :src="getImageUrl(skill.icon)" 
            :alt="skill.name"
            class="skill-icon"
          />
          <span v-else class="skill-text">{{ skill.text }}</span>
        </div>
        <div class="bubble-glow"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container {
  padding: 5rem 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.skills-playground {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.skill-bubble {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-color);
  border: var(--border-width) solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 6px 6px 0px var(--border-color);
}

/* Category specific tints - removed for monochrome/brutalist consistency */
.skill-bubble.language,
.skill-bubble.core,
.skill-bubble.tool,
.skill-bubble.domain { 
  border-color: var(--border-color); 
}

.skill-bubble:hover {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px var(--border-color);
  background: var(--text-color);
}

.skill-bubble:hover .skill-text {
  color: var(--bg-color);
}

.skill-bubble:hover .skill-icon {
  filter: invert(1) grayscale(100%);
}

.bubble-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 2;
  width: 100%;
}

.skill-icon {
  width: 4.2rem;
  height: 4.2rem;
  object-fit: contain;
  transition: filter 0.1s;
  filter: grayscale(100%) contrast(1.2); /* Force monochrome */
}

.skill-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-color);
  font-family: var(--font-mono);
  text-transform: uppercase;
}

.bubble-glow {
  display: none;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .skills-playground {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .skill-bubble {
    box-shadow: 4px 4px 0px var(--border-color);
  }
  
  .skill-icon {
    width: 3rem;
    height: 3rem;
  }
  
  .skill-text {
    font-size: 1rem;
  }
}
</style>
