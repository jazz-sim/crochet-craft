<script lang="ts">
    import { Vector3 } from 'three';
    export let points: Vector3[] = [new Vector3(0, 0, 0)];
</script>

<div>
    <table id="points-table" class="rounded-lg">
        <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>Z</th>
                <th rowspan="2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each points as point, index}
                <tr>
                    <td>
                        <input
                            class="input"
                            type="number"
                            value={point.x}
                            on:change={(e) => {
                                points[index] = new Vector3(
                                    e.currentTarget.valueAsNumber,
                                    point.y,
                                    point.z,
                                );
                            }}
                        />
                    </td>
                    <td>
                        <input
                            class="input"
                            type="number"
                            value={point.y}
                            on:change={(e) => {
                                points[index] = new Vector3(
                                    point.x,
                                    e.currentTarget.valueAsNumber,
                                    point.z,
                                );
                            }}
                        />
                    </td>
                    <td>
                        <input
                            class="input"
                            type="number"
                            value={point.z}
                            on:change={(e) => {
                                points[index] = new Vector3(
                                    point.x,
                                    point.y,
                                    e.currentTarget.valueAsNumber,
                                );
                            }}
                        />
                    </td>
                    <td
                        ><button
                            on:click={() => {
                                points = [
                                    ...points.slice(0, index),
                                    new Vector3(point.x, point.y, point.z),
                                    ...points.slice(index),
                                ];
                            }}>+</button
                        ></td
                    >
                    <td
                        ><button
                            disabled={points.length == 1 ? true : false}
                            on:click={() => {
                                points = [...points.slice(0, index), ...points.slice(index + 1)];
                            }}>-</button
                        ></td
                    >
                </tr>
            {/each}
        </tbody>
    </table>
    <br />
    <button
        class="variant-filled-primary btn rounded-lg"
        on:click={() => {
            points = [new Vector3(0, 0, 0), ...points];
        }}>Add point to start</button
    >
</div>

<style>
    #points-table {
        border: 1px solid black;
        border-collapse: collapse;
    }

    #points-table td {
        border: 1px solid black;
        min-width: 2em;
    }
    #points-table td input {
        border: none;
        box-sizing: border-box;
        display: relative;
        width: 100%;
    }
</style>
