<div class="card mt-4 w-full shadow-md md:px-4 md:py-2">
	<div class="card-header">
		<h2 class="h3">
			<slot name="header" />
		</h2>
		<p class="py-2 text-surface-400">
			<slot name="header-subtitle" />
		</p>
	</div>
	<slot name="body" />
</div>
