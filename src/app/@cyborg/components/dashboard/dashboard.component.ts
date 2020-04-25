import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {ClientsService, JobsService, PoliciesService, StatsService} from '../../services';
import {HumanSizePipe} from '../../pipes';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'cbg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;
  updateOptions: any;
  calendarPlugins = [dayGridPlugin]; // important!
  events: any;

  clients: number;
  tasks: number;
  errors: number;
  policies: number;

  private data: {
    success: any[],
    failed: any[],
    size: any[],
    dedup: any[]
  };

  private mockData =   [{
        date: '2020-04-02',
        size: 543789800590,
        dedup: 18708982268,
        success: 39,
        failed: 1
      },
    {
      date: '2020-04-03',
      size: 540434390590,
      dedup: 19904342589,
      success: 39,
      failed: 1
    },
    {
      date: '2020-04-04',
        size: 439494530760,
        dedup: 6686386239,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-05',
        size: 440108420590,
        dedup: 6396784188,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-06',
        size: 509719200588,
        dedup: 41831943077,
        success: 73,
        failed: 3
    },
    {
      date: '2020-04-07',
        size: 544408550590,
        dedup: 27740714979,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-08',
        size: 544715450590,
        dedup: 66020465209,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-09',
        size: 544079060590,
        dedup: 65902826198,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-10',
        size: 545432720590,
        dedup: 65329186568,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-11',
        size: 552946810590,
        dedup: 66480286849,
        success: 40,
        failed: 1
    },
    {
      date: '2020-04-12',
        size: 547500700590,
        dedup: 64684836069,
        success: 39,
        failed: 1
    },
    {
      date: '2020-04-13',
        size: 545054090590,
        dedup: 64899886069,
        success: 39,
        failed: 1
    }];

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
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
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
              formatter: (function(value){
                return new Date(value).toLocaleDateString();
              }),
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return new Date(params.value).toLocaleDateString();
                }
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
                formatter: function (params) {
                  return Math.round(params.value);
                }
              }
            }
          },
          {
            type: 'value',
            name: 'Size',
            axisLabel: {
              formatter: (function(value) {
                return new HumanSizePipe().transform(value);
              }),
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return new HumanSizePipe().transform(params.value);
                }
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
        for (const el of this.mockData ) {
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
      for ( const event of res ) {
        for ( const item of event.schedules ) {
          const className = !event.enabled ? 'calendar-event-disable' : '';
          this.events.push({title: event.name, start: item, className});
        }
      }
    });
    this.policiesService.count().subscribe((count) => {
      this.policies = count;
    });
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
