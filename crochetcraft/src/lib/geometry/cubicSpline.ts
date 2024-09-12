type SplineType = 'CLAMPED' | 'NATURAL' | 'PERIODIC';

/**
 * Solver function specifically designed for the cubic polynomial case
 * with evenly spaced points, where every `x_(i+1) - x_i = 1`.
 *
 * Numbers taken from CS 370. The tridiagonal matrix should be made of the form:
 * ```
 * 1/3, 1/6, ...
 * ...
 * ...   1/6, 2/3, 1/6, ...
 * ...
 * ...        ...   1/3  1/6
 * ```
 * so any magic numbers come from some combination of these.
 * (In most cases, I opt to multiple the numerators and denominators of the results by some value to remove
 * fractions within fractions).
 *
 * Algorithm from https://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
 */
function solveCubicSplineTridiagonal(y: number[]) {
    const n = y.length;

    const cPrime: number[] = new Array(n - 1);
    cPrime[0] = 0.5;
    for (let i = 1; i < n - 1; ++i) {
        cPrime[i] = 1 / (4 - cPrime[i - 1]);
    }

    const dPrime: number[] = new Array(n);
    dPrime[0] = y[0] * 3;
    for (let i = 1; i < n; ++i) {
        dPrime[i] = (6 * y[i] - dPrime[i - 1]) / (4 - cPrime[i - 1]);
    }
    dPrime[n - 1] = (6 * y[n - 1] - dPrime[n - 2]) / (2 - cPrime[n - 2]);

    const x: number[] = new Array(n);
    x[n - 1] = dPrime[n - 1];
    for (let i = n - 2; i >= 0; --i) {
        x[i] = dPrime[i] - cPrime[i] * x[i + 1];
    }

    return x;
}

/**
 * A periodic cubic spline interpolator for a set of
 * evenly spaced points of the form
 *
 * `[0, y_0], [1, y_1], ...`
 */
export class CubicInterpolator {
    a: number[];
    b: number[];
    c: number[];

    /**
     *
     * @param y The list of (evenly spaced) inputs
     */
    constructor(y: number[]) {
        const n = y.length;

        const targets: number[] = new Array(n);
        for (let i = 1; i < n - 1; ++i) {
            targets[i] = y[i + 1] - 2 * y[i] + y[i - 1];
        }

        // Periodic spline boudnary conditions
        targets[0] = y[1] - y[0] - (y[n - 1] - y[n - 2]);
        targets[n - 1] = targets[0];

        const a = solveCubicSplineTridiagonal(targets);
        const b = new Array(n - 1);
        const c = new Array(n - 1);
        for (let i = n - 2; i >= 0; --i) {
            b[i] = y[i] - a[i] / 6;
            c[i] = y[i + 1] - a[i + 1] / 6;
        }

        this.a = a;
        this.b = b;
        this.c = c;
    }

    /**
     * Gets the interpolated value `p(t)`.
     *
     * @param t A number within `[0, n - 1]`
     */
    interpolate(t: number): number {
        const i = Math.min(Math.max(0, Math.floor(t)), this.a.length - 1);
        return (
            (this.a[i] * Math.pow(i + 1 - t, 3)) / 6 +
            (this.a[i + 1] * Math.pow(t - i, 3)) / 6 +
            this.b[i] * (i + 1 - t) +
            this.c[i] * (t - i)
        );
    }

    /**
     * Evenly samples the spline for `samples` points in total.
     *
     * @param samples the number of samples
     */
    sample(samples: number): number[] {
        const n = this.a.length;
        const out: number[] = new Array(samples);
        for (let i = 0; i < samples; ++i) {
            out[i] = this.interpolate((n / samples) * i);
        }
        return out;
    }
}
