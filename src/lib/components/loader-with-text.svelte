<script lang="ts">
	export let size = 18;
	export let text = 'Loading...';
</script>

<div class="wrapper">
	<svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 100 100">
		<circle
			fill="none"
			stroke="currentColor"
			stroke-width="9"
			cx="50"
			cy="50"
			r="40"
			opacity="0.5"
		/>
		<circle fill="currentColor" stroke="currentColor" stroke-width="7" cx="13" cy="54" r="9">
			<animateTransform
				attributeName="transform"
				dur="2s"
				type="rotate"
				from="0 50 48"
				to="360 50 52"
				repeatCount="indefinite"
			/>
		</circle>
	</svg>
	<p class="text">
		{text}
	</p>
</div>

<style>
	.wrapper {
		text-align: center;
		margin-top: 2rem;
		padding: 1rem;
		color: inherit;
		background-color: transparent;
	}
	.text {
		text-align: center;
		font-family: 'Poppins', sans-serif;
		font-weight: 200;
		font-size: 16px;
		color: inherit;
		padding: 0;
		margin: 0;
	}
</style>
