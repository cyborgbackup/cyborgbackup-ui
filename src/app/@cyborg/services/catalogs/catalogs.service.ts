import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { CrudService } from '../crud/crud.service';
import { expand, takeLast} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService extends CrudService {
  endpoint = 'catalogs';
  maxRecursion = 20;

  private archiveName: string = null;
  private urlPath: string;

  public getArchivesNames(): Observable<any> {
    return new Observable((subscriber) => {
      const params = {};
      const url = '/api/v1/jobs/?fields=archive_name&not__archive_name=&archive_name__isnull=False&order=-archive_name&page_size=10000';
      this.http.get(url, params).subscribe((result: any) => {
        subscriber.next(result.results);
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  public getArchiveInfo(archiveName: string): Observable<any> {
    return new Observable((subscriber) => {
      const params = {};
      const url = '/api/v1/jobs/?archive_name=' + archiveName;
      this.http.get(url, params).subscribe((result: any) => {
        subscriber.next(result.results[0]);
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  requestPages(startPath, recursive): Observable<any> {
    if (this.archiveName) {
      this.urlPath = '/api/v1/escatalogs/?archive_name=' + this.archiveName + '&path__regexp=' + startPath;
      return this.http.get(this.urlPath).pipe(
          expand( (data: any)  => {
            this.urlPath += '/[^/]*';
            return data.count === 0 && recursive && startPath.split('*').length < this.maxRecursion ? this.http.get(this.urlPath) : EMPTY;
          }),
          takeLast(1)
      );
    } else {
      return null;
    }
  }

  public getPathEntries(archiveName: string, path: string = null): Observable<any> {
    this.archiveName = archiveName;
    let recursive: boolean;
    if ( path === null ) {
      path = '[^/]*';
      recursive = true;
    } else {
      path = path + '/[^/]*';
      recursive = false;
    }
    return new Observable((subscriber) => {
      const url = '/api/v1/escatalogs/?archive_name=' + this.archiveName;
      this.http.get(url, {}).subscribe((result: any) => {
        if (result.count > 0 ) {
          this.requestPages(path, recursive).subscribe((data) => {
            subscriber.next(data.results);
          });
        } else {
          subscriber.next(false);
        }
      }, (error) => {
        subscriber.error(error);
      });
    });
  }
}
