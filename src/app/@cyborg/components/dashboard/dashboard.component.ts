import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {ClientsService, JobsService, PoliciesService, StatsService} from '../../services';
import {HumanSizePipe} from '../../pipes';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarOptions} from '@fullcalendar/core';

@Component({
    selector: 'cbg-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy, OnInit {
    options: any = {};
    themeSubscription: any;
    updateOptions: any;
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin]
    };
    events: any;

    clients: number;
    tasks: number;
    errors: number;
    policies: number;

    private data: {
        success: any[];
        failed: any[];
        size: any[];
        dedup: any[];
    };

    constructor(private theme: NbThemeService,
                private statsService: StatsService,
                private policiesService: PoliciesService,
                private jobsService: JobsService,
                private clientsService: ClientsService) {
        this.events = [];
    }

    ngAfterViewInit() {
        this.data = {
            success: [],
            failed: [],
            size: [],
            dedup: []
        };
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {

            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
            this.options = {
                backgroundColor: echarts.bg,
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            color: echarts.tooltipTextStyleColor,
                            backgroundColor: echarts.textColor
                        },
                    },
                },
                legend: {
                    data: ['Failed', 'Success', 'Original Size', 'Deduplicated Size'],
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                grid: {
                    top: 70,
                    bottom: 50,
                },
                xAxis: [
                    {
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors.info,
                            },
                        },
                        axisLabel: {
                            formatter: (value) => new Date(value).toLocaleDateString(),
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: (params) => new Date(params.value).toLocaleDateString(),
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Backups',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: echarts.splitLineColor,
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: (params) => Math.round(params.value)
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: 'Size',
                        axisLabel: {
                            formatter: (value) => new HumanSizePipe().transform(value),
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: (params) => new HumanSizePipe().transform(params.value)
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: echarts.splitLineColor,
                            },
                        },
                    },
                ]
                ,
                series: [
                    {
                        name: 'Failed',
                        type: 'line',
                        smooth: true,
                        data: [],
                    },
                    {
                        name: 'Success',
                        type: 'line',
                        smooth: true,
                        data: [],
                    },
                    {
                        name: 'Original Size',
                        type: 'bar',
                        data: [],
                        yAxisIndex: 1
                    },
                    {
                        name: 'Deduplicated Size',
                        type: 'bar',
                        data: [],
                        yAxisIndex: 1
                    },
                ],
            };
            this.statsService.fetch().subscribe((res) => {
                for (const el of res) {
                    this.data.success.push([new Date(el.date).toISOString(), el.success]);
                    this.data.failed.push([new Date(el.date).toISOString(), el.failed]);
                    this.data.size.push([new Date(el.date).toISOString(), el.size]);
                    this.data.dedup.push([new Date(el.date).toISOString(), el.dedup]);
                }
                this.updateOptions = {
                    series: [{
                        data: this.data.failed
                    },
                        {
                            data: this.data.success
                        },
                        {
                            data: this.data.size
                        },
                        {
                            data: this.data.dedup
                        }]
                };
            });
        });
    }

    ngOnInit(): void {
        this.policiesService.calendar().subscribe((res) => {
            for (const event of res) {
                for (const item of event.schedules) {
                    const className = !event.enabled ? 'calendar-event-disable' : '';
                    this.events.push({title: event.name, start: item, className});
                }
            }
        });
        this.policiesService.count().subscribe((count) => {
            this.policies = count;
        });
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.jobsService.count({params: {or__status: ['failed', 'error']}}).subscribe((count) => {
            this.errors = count;
        });
        this.jobsService.count().subscribe((count) => {
            this.tasks = count;
        });
        this.clientsService.count().subscribe((count) => {
            this.clients = count;
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }

}
