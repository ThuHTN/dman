import {
  BehaviorSubject,
  map,
  Subscription,
  combineLatestWith,
  shareReplay,
} from "rxjs";
import { onMounted, onUnmounted } from "vue";

export function dman<T>() {
  let mut$ = new BehaviorSubject<{ find: {}; mutate: {} }>({
    find: {},
    mutate: {},
  });

  let push$ = new BehaviorSubject<T | null>(null);
  let add$ = new BehaviorSubject<Array<((arg: T) => object) | object>>([]);
  let remove$ = new BehaviorSubject<Array<object>>([]);

  let set$ = new BehaviorSubject<T[]>([]);

  let source$ = set$.pipe(
    combineLatestWith(push$),
    map(([ob1, ob2]) => {
      if (ob2) {
        ob1.push(ob2);
        console.log("ob1", ob1);
      }
      return ob1;
    }),
    combineLatestWith(mut$),
    map(([ob1, ob2]) => {
      return ob1.map((val) => {
        let checkFind = false;
        const keysArray = Object.keys(ob2.find);
        const valuesArray = Object.values(ob2.find);
        keysArray.map((key: any | keyof T, i: number) => {
          const getKey: keyof T = key;
          if (val[getKey] === valuesArray[i]) {
            checkFind = true;
          }
        });
        if (checkFind) {
          return { ...val, ...ob2.mutate };
        }
        return val;
      });
    }),
    combineLatestWith(add$),
    map(([ob1, ob2]) =>
      ob1.map((value) => {
        let originalValue = value;
        ob2.forEach((value2) => {
          if (typeof value2 === "function") {
            originalValue = value2(originalValue);
          } else {
            originalValue = { ...originalValue, ...value2 };
          }
        });
        return originalValue;
      })
    ),
    combineLatestWith(remove$),
    map(([ob1, ob2]) => {
      ob2.map((ob2Val) => {
        const keysArray = Object.keys(ob2Val);
        const valArray = Object.values(ob2Val);

        const checkBolArray: Array<boolean> = [];
        let checkArrayMatch: boolean = false;
        keysArray.map((key, i: number) => {
          const getKey = key as keyof T;
          const find = ob1.find((ob1Val) => ob1Val[getKey] === valArray[i]);
          if (find) checkBolArray.push(true);
        });

        if (
          checkBolArray.length === keysArray.length &&
          checkBolArray.every((bol) => bol)
        ) {
          keysArray.map((key, i: number) => {
            const getKey = key as keyof T;
            ob1 = ob1.filter((ob1Val) => ob1Val[getKey] !== valArray[i]);
          });
        }
      });
      return ob1;
    }),
    shareReplay()
  );

  function returnObjects() {
    return {
      addField,
      push,
      remove,
      mutate,
      set,
      subscribe: sub,
    };
  }

  function set(value: T[]) {
    set$.next(value);
    return returnObjects();
  }

  function addField(method: {} | ((param: T) => object)) {
    add$.next([...add$.value, method]);
    return returnObjects();
  }

  function push(obj: T) {
    // push$.next([...push$.value, obj]);
    push$.next(obj);
  }

  function remove(obj: object) {
    remove$.next([...remove$.value, obj]);
  }

  function mutate(find: object, mut: object) {
    mut$.next({ find, mutate: mut });
    return returnObjects();
  }

  let subscribe: Subscription;

  function sub(cb: (data: any) => any) {
    onMounted(() => {
      subscribe = source$.subscribe(cb);
    });
    onUnmounted(() => {
      subscribe.unsubscribe();
    });
  }

  return returnObjects();
}
