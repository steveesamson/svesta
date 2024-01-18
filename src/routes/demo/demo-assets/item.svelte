<script lang="ts">
	export let avatar: string = '';
	export let first_name: string = '';
	export let last_name: string = '';
	export let email: string = '';
</script>

<li class="directory">
	<div class="image">
		<img src={avatar} alt="user avatar" loading="lazy" />
	</div>
	<div class="detail">
		<strong>{first_name} {last_name}</strong>
		<em>{email}</em>
	</div>
</li>

<style>
	.directory {
		display: flex;
		justify-content: flex-start;
		background-color: #fff;
		border: 1px solid #fff;
		margin: 1px 0;
		padding: 0.5rem;
		color: steelblue;
		text-align: left;
		box-shadow: 0px 2px 4px rgba(32, 32, 32, 0.11);
		transition: all 0.37s ease-in-out;
		cursor: pointer;
	}
	.directory:hover {
		background-color: #eee;
		border-color: #eee;
	}

	.image {
		width: 60px;
		min-width: 60px;
		height: 60px;
		min-height: 60px;
		margin-right: 8px;
		border: 2px solid steelblue;
		background-color: #efefef;
		border-radius: 50%;
		overflow: hidden;
	}
	.detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.detail strong {
		font-size: 18px;
		margin-bottom: 8px;
	}
	.detail em {
		font-size: 16px;
		font-style: normal;
		color: #666;
	}
	.image img {
		width: 100%;
		min-width: 100%;
	}

	@media screen and (min-width: 400px) {
		.directory {
			border-radius: 8px;
		}
	}
	@media screen and (min-width: 600px) {
		.directory {
			margin: 0;
		}
	}
</style>
