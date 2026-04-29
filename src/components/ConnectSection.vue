<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { Clipboard, Github, Instagram, Linkedin, Mail, Send } from 'lucide-vue-next'

const email = 'kaustubhk375@gmail.com'
const form = ref({
  name: '',
  from: '',
  message: '',
})
const toastMessage = ref('')
let toastTimeout = null

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`Portfolio contact from ${form.value.name || 'visitor'}`)
  const body = encodeURIComponent([
    form.value.message,
    '',
    `Name: ${form.value.name}`,
    `Email: ${form.value.from}`,
  ].join('\n'))

  return `mailto:${email}?subject=${subject}&body=${body}`
})

const showToast = (message) => {
  toastMessage.value = message
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const fallbackCopy = () => {
  const input = document.createElement('textarea')
  input.value = email
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

const copyEmail = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email)
    } else {
      fallbackCopy()
    }

    showToast('Email copied')
  } catch {
    showToast(email)
  }
}

const sendMessage = () => {
  window.location.href = mailtoHref.value
  showToast('Opening mail app')
}

onUnmounted(() => {
  clearTimeout(toastTimeout)
})
</script>

<template>
  <section id="connect" class="section-container text-center">
    <h2 class="section-title">Let's Connect</h2>

    <div class="status-badge">
      <span class="status-dot-container">
        <span class="status-ping"></span>
        <span class="status-dot"></span>
      </span>
      Status: active
    </div>

    <div class="connect-grid">
      <a href="https://github.com/wigiwee" target="_blank" rel="noopener noreferrer" class="connect-card">
        <div class="card-content">
          <Github class="connect-icon" />
          <span class="connect-label">GitHub</span>
          <span class="connect-sub">Check my repos</span>
        </div>
        <div class="card-glow"></div>
      </a>

      <a href="https://www.linkedin.com/in/kaustubh-kolhe-661143279/" target="_blank" rel="noopener noreferrer" class="connect-card">
        <div class="card-content">
          <Linkedin class="connect-icon" />
          <span class="connect-label">LinkedIn</span>
          <span class="connect-sub">Let's connect</span>
        </div>
        <div class="card-glow"></div>
      </a>

      <a :href="`mailto:${email}`" class="connect-card">
        <div class="card-content">
          <Mail class="connect-icon" />
          <span class="connect-label">Email</span>
          <span class="connect-sub">Say hello</span>
        </div>
        <div class="card-glow"></div>
      </a>

      <a href="https://instagram.com/kaustubh.o_o" target="_blank" rel="noopener noreferrer" class="connect-card">
        <div class="card-content">
          <Instagram class="connect-icon" />
          <span class="connect-label">Instagram</span>
          <span class="connect-sub">Follow me</span>
        </div>
        <div class="card-glow"></div>
      </a>
    </div>

    <div class="contact-panel">
      <div class="email-row">
        <span class="email-value">{{ email }}</span>
        <button type="button" class="copy-btn" @click="copyEmail">
          <Clipboard class="btn-icon" />
          Copy
        </button>
      </div>

      <form class="contact-form" @submit.prevent="sendMessage">
        <div class="field-grid">
          <label>
            <span>Name</span>
            <input v-model.trim="form.name" type="text" name="name" autocomplete="name" required />
          </label>
          <label>
            <span>Email</span>
            <input v-model.trim="form.from" type="email" name="email" autocomplete="email" required />
          </label>
        </div>

        <label>
          <span>Message</span>
          <textarea v-model.trim="form.message" name="message" rows="5" required></textarea>
        </label>

        <button type="submit" class="send-btn">
          <Send class="btn-icon" />
          Send Message
        </button>
      </form>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast" role="status" aria-live="polite">
        {{ toastMessage }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.section-container {
  padding: 5rem 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.text-center {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 700;
  border: var(--border-width) solid var(--border-color);
  margin-bottom: 3rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  box-shadow: 4px 4px 0px var(--border-color);
}

.status-dot-container {
  position: relative;
  display: flex;
  width: 0.75rem;
  height: 0.75rem;
}

.status-ping {
  display: none;
}

.status-dot {
  position: relative;
  display: inline-flex;
  height: 0.75rem;
  width: 0.75rem;
  background-color: var(--text-color);
  border-radius: 50%;
}

.connect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 1024px) {
  .connect-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.connect-card {
  position: relative;
  height: 200px;
  background: var(--bg-color);
  border: var(--border-width) solid var(--border-color);
  overflow: hidden;
  transition: all 0.1s;
  text-decoration: none;
  box-shadow: 8px 8px 0px var(--border-color);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.connect-icon {
  width: 3rem;
  height: 3rem;
  color: var(--text-color);
  transition: all 0.1s;
}

.connect-label {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-color);
  font-family: var(--font-display);
  text-transform: uppercase;
}

.connect-sub {
  font-size: 1rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
}

.card-glow {
  display: none;
}

/* Hover Effects */
.connect-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0px var(--border-color);
  background: var(--text-color);
}

.connect-card:hover .connect-icon {
  color: var(--bg-color);
  transform: scale(1.1);
}

.connect-card:hover .connect-label {
  color: var(--bg-color);
}

.connect-card:hover .connect-sub {
  color: var(--bg-color);
}

.contact-panel {
  margin: 3rem auto 0;
  max-width: 900px;
  border: var(--border-width) solid var(--border-color);
  box-shadow: 8px 8px 0px var(--border-color);
  text-align: left;
}

.email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: var(--border-width) solid var(--border-color);
}

.email-value {
  font-family: var(--font-display);
  font-size: 1.35rem;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}

.copy-btn,
.send-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 900;
  padding: 0.8rem 1.25rem;
  text-transform: uppercase;
  box-shadow: 4px 4px 0px var(--border-color);
  transition: all 0.1s;
  white-space: nowrap;
}

.copy-btn:hover,
.send-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-color);
  background: var(--text-color);
  color: var(--bg-color);
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-color);
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  border: var(--border-width) solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem;
  outline: none;
}

.contact-form textarea {
  resize: vertical;
  min-height: 150px;
}

.contact-form input:focus,
.contact-form textarea:focus {
  box-shadow: 4px 4px 0px var(--border-color);
}

.send-btn {
  align-self: flex-start;
}

.toast {
  position: fixed;
  right: 2rem;
  bottom: 6.5rem;
  z-index: 150;
  border: var(--border-width) solid var(--border-color);
  background: var(--text-color);
  color: var(--bg-color);
  box-shadow: 6px 6px 0px var(--border-color);
  font-family: var(--font-mono);
  font-weight: 900;
  padding: 1rem 1.25rem;
  text-transform: uppercase;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .email-row,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .email-row {
    align-items: stretch;
    flex-direction: column;
  }

  .copy-btn,
  .send-btn {
    width: 100%;
  }

  .toast {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    text-align: center;
  }
}
</style>
