import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/CP9GDPSDemonList/data';

export async function fetchList() {
    const listResult = await fetch(`${dir}/list.json`);
    if (!listResult.ok) {
        throw new Error(`Failed to fetch list: ${listResult.statusText}`);
    }
    const list = await listResult.json();
    return await Promise.all(
        list.map(async (path) => {
            const levelResult = await fetch(`${dir}/${path}.json`);
            if (!levelResult.ok) {
                throw new Error(`Failed to fetch level: ${levelResult.statusText}`);
            }
            const level = await levelResult.json();
            return {
                ...level,
                path,
                records: level.records.sort((a, b) => b.percent - a.percent),
            };
        })
    );
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    list.forEach((level, rank) => {
        // Verification
        scoreMap[level.verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };
        const { verified } = scoreMap[level.verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
        });

        // Records
        level.records.forEach((record) => {
            scoreMap[record.user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[record.user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return res.sort((a, b) => b.total - a.total);
}