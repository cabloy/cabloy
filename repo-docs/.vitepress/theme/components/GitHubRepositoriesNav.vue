<script setup>
import { nextTick, onMounted, onUnmounted, ref, useId } from 'vue';

const props = defineProps({
  repositories: {
    type: Array,
    required: true,
  },
  screenMenu: Boolean,
});

const isOpen = ref(false);
const root = ref();
const trigger = ref();
const menu = ref();
const menuId = useId();

function close({ returnFocus = false } = {}) {
  isOpen.value = false;
  if (returnFocus) {
    trigger.value?.focus();
  }
}

async function open({ focusIndex } = {}) {
  isOpen.value = true;
  if (focusIndex === undefined) return;

  await nextTick();
  menu.value?.querySelectorAll('a')[focusIndex]?.focus();
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

function handleTriggerKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    open({ focusIndex: 0 });
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    open({ focusIndex: props.repositories.length - 1 });
  } else if (event.key === 'Escape') {
    close();
  }
}

function handleMenuKeydown(event) {
  const links = [...menu.value.querySelectorAll('a')];
  const index = links.indexOf(document.activeElement);
  if (index === -1) return;

  let nextIndex;
  if (event.key === 'ArrowDown') {
    nextIndex = (index + 1) % links.length;
  } else if (event.key === 'ArrowUp') {
    nextIndex = (index - 1 + links.length) % links.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = links.length - 1;
  } else if (event.key === 'Escape') {
    event.preventDefault();
    close({ returnFocus: true });
    return;
  } else {
    return;
  }

  event.preventDefault();
  links[nextIndex]?.focus();
}

function handlePointerDown(event) {
  if (isOpen.value && !root.value?.contains(event.target)) {
    close();
  }
}

function handleFocusIn(event) {
  if (isOpen.value && !root.value?.contains(event.target)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('focusin', handleFocusIn);
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', handlePointerDown);
  document.removeEventListener('focusin', handleFocusIn);
});
</script>

<template>
  <section v-if="screenMenu" class="cabloy-github-repositories cabloy-github-repositories--screen">
    <p class="cabloy-github-repositories__title">GitHub repositories</p>
    <a
      v-for="repository in repositories"
      :key="repository.link"
      class="cabloy-github-repositories__screen-link"
      :href="repository.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ repository.text }}
    </a>
  </section>

  <div v-else ref="root" class="cabloy-github-repositories">
    <button
      ref="trigger"
      class="cabloy-github-repositories__trigger"
      type="button"
      aria-label="GitHub repositories"
      aria-haspopup="menu"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.095.682-.223.682-.494 0-.244-.009-1.05-.014-1.906-2.782.621-3.369-1.215-3.369-1.215-.455-1.185-1.11-1.5-1.11-1.5-.908-.64.069-.627.069-.627 1.004.073 1.532 1.057 1.532 1.057.892 1.567 2.341 1.114 2.91.852.09-.663.349-1.115.635-1.371-2.22-.26-4.555-1.139-4.555-5.067 0-1.12.39-2.034 1.03-2.752-.104-.26-.447-1.306.098-2.724 0 0 .84-.278 2.75 1.051A9.3 9.3 0 0 1 12 6.89a9.3 9.3 0 0 1 2.504.347c1.909-1.33 2.748-1.051 2.748-1.051.546 1.418.203 2.464.1 2.724.64.718 1.028 1.632 1.028 2.752 0 3.938-2.339 4.804-4.566 5.058.359.32.678.947.678 1.91 0 1.38-.012 2.492-.012 2.832 0 .274.18.594.688.493C19.14 20.619 22 16.78 22 12.253 22 6.59 17.523 2 12 2Z"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      :id="menuId"
      ref="menu"
      class="cabloy-github-repositories__menu"
      role="menu"
      aria-label="GitHub repositories"
      @keydown="handleMenuKeydown"
    >
      <a
        v-for="repository in repositories"
        :key="repository.link"
        class="cabloy-github-repositories__menu-link"
        :href="repository.link"
        role="menuitem"
        target="_blank"
        rel="noopener noreferrer"
        @click="close"
      >
        {{ repository.text }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.cabloy-github-repositories {
  position: relative;
  display: flex;
  align-items: center;
}

.cabloy-github-repositories__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.cabloy-github-repositories__trigger:hover,
.cabloy-github-repositories__trigger[aria-expanded='true'] {
  color: var(--vp-c-text-1);
}

.cabloy-github-repositories__trigger:focus-visible,
.cabloy-github-repositories__menu-link:focus-visible,
.cabloy-github-repositories__screen-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.cabloy-github-repositories__trigger svg {
  width: 20px;
  height: 20px;
}

.cabloy-github-repositories__menu {
  position: absolute;
  z-index: 1;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

.cabloy-github-repositories__menu-link,
.cabloy-github-repositories__screen-link {
  display: block;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.cabloy-github-repositories__menu-link {
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: nowrap;
}

.cabloy-github-repositories__menu-link:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.cabloy-github-repositories--screen {
  display: block;
  padding: 12px 0;
}

.cabloy-github-repositories__title {
  margin: 0 0 4px;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25rem;
  text-transform: uppercase;
}

.cabloy-github-repositories__screen-link {
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5rem;
}

.cabloy-github-repositories__screen-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
