<script lang="ts">
	import { pb } from "./bird";

    async function handleLogin() {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        // TODO: don't reload the entire page when a user logs in...
        location.reload();
    }

    async function handleLogout() {
        pb.authStore.clear();
        // TODO: don't reload the entire page when a user logs in...
        location.reload();
    }
</script>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    nav > a {
        color: black;
        text-decoration: none;
    }
</style>

<nav>
    <a href="/"><h1>Birdthing</h1></a>

    {#if pb.authStore.isValid}
        <button on:click={handleLogout} on:keypress={handleLogout}>Log Out</button>
    {:else}
        <button on:click={handleLogin} on:keypress={handleLogin}>Log In</button>
    {/if}
</nav>