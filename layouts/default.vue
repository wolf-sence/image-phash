<template>
  <div>
    this is default layout
    <slot />
    <ul>
      <li>
        <NuxtLink to="/preview">preview</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/">index</NuxtLink>
      </li>
    </ul>
  </div>
</template>