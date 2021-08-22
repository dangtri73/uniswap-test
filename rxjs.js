const {Observable} = require("rxjs");
const { map, filter, scan } = require('rxjs/operators');

/**
 * func tạo observable
 * @function observable ()
 */
const observable = new Observable((observer) => { // = voi Rx.Observable.create()
  console.log("Rxjs và Reactive Programming");
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});

/**
 * func trả về observable
 * @function returnObservable ()
*/

const returnObservable = () => {
  return new Observable(function testObserver(observer) {
    observer.next(console.log("return here"));
  });
};

/**
 * func order of observable
 * @function runFlowObserver ()
*/
const runFlowObserver = () => {
    console.log('before subscribe');
    /**
     * 1 observer chuẩn gồm 3 thành phần theo thứ tự
     */
    const observer = {
      next: (val) => console.log("next: " + val),
      error: (err) => console.error("error: " + err),
      complete: () => console.log("done"),
    };
    observable.subscribe(observer);
    console.log('after subscribe');
    /**
     * Hủy 1 subscription
     * @var subscription
     */
    const subscription = returnObservable().subscribe();
    /**
     * có thể add thêm 1 subscription con vào subscription cha
     * @alias subscription.add(childSub); 
     */
    subscription.unsubscribe();

}

const 

runProgram();


