<div class="card mt-4 md:px-4 md:py-2 w-full">
    <div class="card-header">
        <h2 class="h3">
            <slot name="header"></slot>
        </h2>
        <p class="text-surface-400 py-2">
        <slot name="header-subtitle"></slot>
        </p>
    </div>
    <slot name="body"></slot>
</div>
