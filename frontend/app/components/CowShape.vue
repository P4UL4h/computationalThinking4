<!-- Stretches with the note. The big belly spot (path "text-spot") holds the text. -->
<template>
  <svg
    class="absolute inset-0 h-full w-full"
    viewBox="0 0 200 140"
    preserveAspectRatio="none"
    stroke="#222"
    stroke-width="2"
  >
    <!-- Tail -->
    <path d="M188 50 C198 70 196 90 192 100" fill="none" />
    <circle cx="192" cy="103" r="4" fill="#222" />
    <!-- Legs with hooves -->
    <g fill="white">
      <rect x="58" y="96" width="14" height="40" />
      <rect x="80" y="96" width="14" height="40" />
      <rect x="146" y="96" width="14" height="40" />
      <rect x="168" y="96" width="14" height="40" />
    </g>
    <g fill="#222">
      <rect x="58" y="130" width="14" height="8" />
      <rect x="80" y="130" width="14" height="8" />
      <rect x="146" y="130" width="14" height="8" />
      <rect x="168" y="130" width="14" height="8" />
    </g>
    <!-- Body -->
    <rect x="48" y="28" width="142" height="80" rx="24" fill="white" />
    <path d="M174 84 C184 82 188 94 182 100 C176 104 168 96 174 84 Z" fill="#222" />
    <path
      class="text-spot"
      d="M76 52 C80 36 122 34 152 40 C174 46 176 74 166 90 C156 106 116 106 90 100 C68 95 70 66 76 52 Z"
      fill="#222"
    />
    <!-- Horns and ears -->
    <path d="M18 22 C12 12 14 6 20 4 C18 12 22 16 26 18 Z" fill="#f5deb3" />
    <path d="M42 18 C46 8 44 2 38 0 C40 8 36 12 32 16 Z" fill="#f5deb3" />
    <ellipse cx="6" cy="30" rx="9" ry="5" fill="white" />
    <ellipse cx="54" cy="28" rx="9" ry="5" fill="white" />
    <!-- Head -->
    <ellipse cx="30" cy="40" rx="22" ry="26" fill="white" />
    <path d="M36 18 C46 20 50 32 44 38 C38 36 34 28 36 18 Z" fill="#222" />
    <circle cx="22" cy="36" r="3" fill="#222" />
    <circle cx="38" cy="36" r="3" fill="#222" />
    <!-- Snout -->
    <ellipse cx="30" cy="60" rx="18" ry="11" fill="#f9a8d4" />
    <circle cx="24" cy="60" r="2.5" fill="#222" stroke="none" />
    <circle cx="36" cy="60" r="2.5" fill="#222" stroke="none" />
  </svg>
</template>
