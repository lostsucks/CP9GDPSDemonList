import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchList } from '../content.js';

import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list">
                    <tr v-for="(level, i) in list" class="list__item" :class="{ 'list__item--active': selected == i }">
                        <td class="list__rank">
                            <p class="type-label-lg">#{{ i + 1 }}</p>
                        </td>
                        <td class="list__level">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level.name }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" :src="embed(level.verification)" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <div class="records">
                        <template v-for="record in level.records" class="record">
                            <div class="percent">
                                <p>{{ record.percent }}%</p>
                            </div>
                            <div class="user">
                                <p>{{ record.user }}</p>
                            </div>
                            <div class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </div>
                            <div class="link">
                                <a :href="record.link">
                                    <img src="/CP9GDPSDemonList/assets/video.svg" alt="Video">
                                </a>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <p>Credits to TheShittyList for the website layout.</p>
                    <h3>List Editors</h3>
                    <ul class="editors">
                        <li>
                            <img src="/CP9GDPSDemonList/assets/crown.svg" alt="Owner">
                            <p>NK87</p>
                        </li>
                        <li>
                            <img src="/CP9GDPSDemonList/assets/user-gear.svg" alt="Helper">
                            <p>hamptonix</p>
                        </li>
                        <li>
                            <img src="/CP9GDPSDemonList/assets/code.svg" alt="Developer">
                            <p>lostsucks</p>
                        </li>
                    </ul>
                    <h3>Submission Requirements</h3>
                    <p>
                        Achieved the record without using hacks (however, FPS bypass is allowed, up to 360fps)
                    </p>
                    <p>
                        Achieved the record on the level that is listed on the site - please check the level ID before you submit a record
                    </p>
                    <p>
                        Have either source audio or clicks/taps in the video. Edited audio only does not count
                    </p>
                    <p>
                        The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this
                    </p>
                    <p>
                        Do not use secret routes or bug routes
                    </p>
                    <h4>Submit in our discord server!</h4>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        loading: true,
        selected: 0,
    }),
    computed: {
        level() {
            return this.list[this.selected];
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
