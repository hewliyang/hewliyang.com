<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="flex justify-center items-center">
    <h1>{$page.status}: {$page.error?.message}</h1>
</div>