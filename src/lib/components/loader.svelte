<script lang="ts">
	let { size = 18, text = 'Loading...', color='#333333' } = $props();
</script>

<div class="wrapper" style="color:{color};">
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
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.25rem;
		text-align: center;
		margin-top: 2rem;
		padding: 1rem;
		color: inherit;
		background-color: transparent;
		z-index: 100;
	}
	@media screen and (min-width: 300px){
		.wrapper {
			flex-direction: row;
		}
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
