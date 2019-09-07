/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

const ChartjsNode = require('chartjs-node');
const mkdirp = require('mkdirp');
const path = require('path');

const base = require('./fileBaseRenderer');

class ChartRenderer {
    static async render(input, data = {}) {
        const outputPath = base.getOutputPath(data);
        mkdirp.sync(outputPath);

        const chartNode = new ChartjsNode(2048, 768);

        return chartNode.drawChart({
            type: 'line',
            data: {
                labels: Array.from(Array(input.generationCount).keys()),
                datasets: [{
                    label: 'Fitness',
                    borderColor: 'rgb(66,133,244)',
                    pointRadius: 1,
                    fill: false,
                    data: input.generations.map(generation => (
                        generation.map(chromosome => chromosome.fitnessValue).reduce((a, b) => a + b, 0) / generation.length
                    ))
                },
                    //     {
                    //     label: 'Median Fitness',
                    //     borderColor: 'rgb(15,157,88)',
                    //     pointRadius: 1,
                    //     fill: false,
                    //     data: input.generations.map(generation => (
                    //         generation.length % 2 !== 0 ? generation.map(chromosome => chromosome.fitnessValue)[Math.floor(generation.length / 2) - 1] : generation.map(chromosome => chromosome.fitnessValue)[Math.floor(generation.length / 2)]
                    //     ))
                    // },
                    {
                        label: 'Minimum fitness',
                        borderColor: 'rgb(219,68,55)',
                        pointRadius: 1,
                        fill: false,
                        data: input.generations.map(generation => (
                            Math.min(...generation.map(chromosome => chromosome.fitnessValue))
                        ))
                    }, {
                        label: 'Maximum fitness',
                        borderColor: 'rgb(244,160,0)',
                        pointRadius: 1,
                        fill: false,
                        data: input.generations.map(generation => (
                            Math.max(...generation.map(chromosome => chromosome.fitnessValue))
                        ))
                    }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Custom Chart Title\nsomething different'
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Fitness value'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Generation'
                        }
                    }]
                }
            }
        })
            .then(() => chartNode.getImageBuffer('image/png'))
            .then(() => chartNode.getImageStream('image/png'))
            .then(() => chartNode.writeImageToFile('image/png', path.join(outputPath, `${base.getOutputFilename(data)}.png`)));
    }
}

module.exports = ChartRenderer;
