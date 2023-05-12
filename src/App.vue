<template>
    <div
        v-if="loading"
        class="w-100 h-100 fixed inset-0 z-50 flex items-center justify-center bg-purple-800 opacity-80"
    >
        <svg
            class="-ml-1 mr-3 h-12 w-12 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    </div>

    <div class="container mx-auto p-4">
        <section class="mt-8">
            <form @submit.prevent="requestTicker">
                <div class="flex">
                    <div class="max-w-xs">
                        <label
                            for="wallet"
                            class="block text-sm font-medium text-gray-700"
                            >Тикер</label
                        >

                        <div class="relative mt-1 rounded-md shadow-md">
                            <input
                                v-model="request"
                                @input="clearErrors"
                                type="text"
                                name="wallet"
                                id="wallet"
                                class="block w-full rounded-md border-gray-300 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                                placeholder="Например DOGE"
                            />
                        </div>

                        <div
                            v-if="suggestions.length"
                            class="flex flex-wrap rounded-md bg-white p-1 shadow-md"
                        >
                            <span
                                v-for="suggestion in shortSuggestions"
                                :key="suggestion.Symbol"
                                @click="
                                    () => {
                                        request = suggestion.Symbol;
                                        requestTicker();
                                    }
                                "
                                tabindex="0"
                                class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
                            >
                                {{ suggestion.Symbol }}
                            </span>
                        </div>

                        <div
                            v-if="error"
                            class="mt-2 text-sm text-red-600"
                        >
                            {{ error }}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="my-4 inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    <!-- Heroicon name: solid/mail -->
                    <svg
                        class="-ml-0.5 mr-2 h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="#ffffff"
                    >
                        <path
                            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                        ></path>
                    </svg>
                    Добавить
                </button>
            </form>
        </section>

        <template v-if="tickers.length">
            <hr class="my-4 w-full border-t border-gray-300" />

            <section>
                <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div
                        v-for="ticker in tickers"
                        :key="ticker.name"
                        @click="
                            () => {
                                if (selectedTicker === ticker) {
                                    selectedTicker = null;
                                    return;
                                }

                                selectedTicker = ticker;
                            }
                        "
                        :class="{ '!outline outline-purple-800': ticker === selectedTicker }"
                        class="cursor-pointer overflow-hidden rounded-lg bg-white shadow outline-none transition hover:shadow-lg focus:shadow-lg"
                        tabindex="0"
                    >
                        <div class="px-4 py-5 text-center sm:p-6">
                            <dt class="truncate text-sm font-medium text-gray-500">
                                {{ ticker.name }} - RUB
                            </dt>
                            <dd class="mt-1 text-3xl font-semibold text-gray-900">
                                {{ ticker.price[ticker.price.length - 1] }}
                            </dd>
                        </div>

                        <button
                            @click.stop="deleteTicker(ticker)"
                            class="text-md relative z-10 flex w-full items-center justify-center border-t border-gray-200 bg-gray-100 px-4 py-4 font-medium text-gray-500 outline-none transition-all hover:bg-gray-200 hover:text-gray-600 focus:bg-gray-200 focus:text-gray-600 active:opacity-75 sm:px-6"
                        >
                            <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#718096"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>

                            Удалить
                        </button>
                    </div>
                </dl>
            </section>
        </template>

        <template v-if="selectedTicker">
            <hr class="my-4 w-full border-t border-gray-300" />

            <section class="relative">
                <h3 class="my-8 text-lg font-medium leading-6 text-gray-900">
                    {{ selectedTicker.name }} - RUB
                </h3>

                <div class="flex h-64 items-end border-b border-l border-gray-300">
                    <div
                        v-for="(graph, index) in normalizeGraph"
                        :key="index"
                        :style="{ height: `${graph}%` }"
                        class="w-10 border bg-purple-800"
                    ></div>
                </div>

                <button
                    @click="selectedTicker = null"
                    type="button"
                    class="absolute right-0 top-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xmlns:svgjs="http://svgjs.com/svgjs"
                        version="1.1"
                        width="30"
                        height="30"
                        x="0"
                        y="0"
                        viewBox="0 0 511.76 511.76"
                        style="enable-background: new 0 0 512 512"
                        xml:space="preserve"
                    >
                        <g>
                            <path
                                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                                fill="#718096"
                                data-original="#000000"
                            ></path>
                        </g>
                    </svg>
                </button>
            </section>
        </template>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                loading: false,
                error: '',
                request: '',
                tickers: [],
                selectedTicker: null,
                allTickers: [],
            };
        },

        mounted() {
            this.getTickers();
        },

        methods: {
            async getTickers() {
                this.loading = true;

                await axios
                    .get('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
                    .then((response) => {
                        this.allTickers = Object.keys(response.data.Data).map(
                            (key) => response.data.Data[key]
                        );
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },

            deleteTicker(tickerToRemove) {
                this.tickers = this.tickers.filter((t) => t !== tickerToRemove);

                if (this.selectedTicker === tickerToRemove) {
                    this.selectedTicker = null;
                }
            },

            issetTicker(tickerName) {
                return !!this.tickers.find((currentTicker) => currentTicker.name === tickerName);
            },

            async requestTicker() {
                this.clearErrors();

                const currentTicker = this.request.toUpperCase();

                if (!currentTicker) {
                    this.error = 'Нужно заполнить';
                    return;
                }

                if (this.issetTicker(currentTicker)) {
                    this.error = 'Тикер уже добавлен';
                    return;
                }

                await axios
                    .get('https://min-api.cryptocompare.com/data/price', {
                        params: {
                            api_key:
                                '1a7434ecfe744b68e69e07b7c3a10d1d883378610ebf06c3dd01d18cc2dc97bb',
                            fsym: currentTicker,
                            tsyms: 'RUB',
                        },
                    })
                    .then((response) => {
                        if (response.data?.Response === 'Error') {
                            this.error = 'Не найден тикет';
                            return;
                        }

                        const ticker = {
                            name: currentTicker,
                            price: [this.formatPrice(response.data.RUB)],
                        };

                        this.tickers.push(ticker);

                        this.subscribeToUpdate(this.tickers[this.tickers.length - 1]);
                    });
            },

            subscribeToUpdate(tickerToUpdate) {
                setInterval(async () => {
                    await axios
                        .get('https://min-api.cryptocompare.com/data/price', {
                            params: {
                                api_key:
                                    '1a7434ecfe744b68e69e07b7c3a10d1d883378610ebf06c3dd01d18cc2dc97bb',
                                fsym: tickerToUpdate.name,
                                tsyms: 'RUB',
                            },
                        })
                        .then((response) => {
                            if (response.data?.Response === 'Error') {
                                return;
                            }

                            tickerToUpdate.price.push(this.formatPrice(response.data.RUB));
                        });
                }, 30000);
            },

            formatPrice(price) {
                return price > 1 ? price.toFixed(2) : price.toPrecision(2);
            },

            clearErrors() {
                this.error = '';
            },
        },

        computed: {
            normalizeGraph() {
                if (!this.selectedTicker) {
                    return [];
                }

                const maxValue = Math.max(...this.selectedTicker.price);
                const minValue = Math.min(...this.selectedTicker.price);

                return this.selectedTicker.price.map(
                    (price) => 5 + (((price - minValue) * 95) / (maxValue - minValue) || 0)
                );
            },

            suggestions() {
                if (!this.request) {
                    return [];
                }

                return this.allTickers.filter((el) => {
                    return (
                        el.FullName.toUpperCase().indexOf(this.request.toUpperCase()) === 0 ||
                        el.Symbol.toUpperCase().indexOf(this.request.toUpperCase()) === 0
                    );
                });
            },

            shortSuggestions() {
                return this.suggestions.slice(0, 4);
            },
        },
    };
</script>
