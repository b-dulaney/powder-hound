<div class="card mt-4 md:px-4 md:py-2">
    <div class="card-header">
        <h3 class="h3">
            <slot name="header"></slot>
        </h3>
        <p class="text-surface-400 py-2">
        <slot name="header-subtitle"></slot>
        </p>
    </div>
    <slot name="body"></slot>
</div>
