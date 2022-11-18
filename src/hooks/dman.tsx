import {
  BehaviorSubject,
  map,
  Subscription,
  combineLatestWith,
  tap,
} from "rxjs";
import { onMounted, onUnmounted } from "vue";

export function dman<T>() {
  let mut$ = new BehaviorSubject<{ find: {}; mutate: {} }>({
    find: {},
    mutate: {},
  });

  let pushAndRemove$ = new BehaviorSubject<{
    type: string | null;
    push: T[];
    remove: any;
  }>({
    type: null,
    push: [],
    remove: null,
  });

  let push$ = new BehaviorSubject<T[]>([]);
  let add$ = new BehaviorSubject<Array<((arg: T) => object) | object>>([]);
  let remove$ = new BehaviorSubject<Array<keyof T | (() => void)>>([]);

  let set$ = new BehaviorSubject<T[]>([]);

  let source$ = set$.pipe(
    combineLatestWith(push$),
    map(([ob1, ob2]) => {
      ob1.push(...ob2);
      return ob1;
      // if (ob2.type === "push") {
      //   ob1.push(...ob2.push);
      //   return ob1;
      // } else if (ob2.type === "remove") {
      //   ob1.map((value) => {
      //     if (typeof ob2.remove === "function") {
      //       return ob2.remove(value);
      //     } else {
      //       const m: keyof T = ob2.remove;
      //       delete value[m];
      //       return value;
      //     }
      //   });
      // }
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
          //   console.log({ ...val, ...ob2.mutate });
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
        console.log({ originalValue });
        return originalValue;
      })
    )
  );

  function returnObjects() {
    return {
      addField,
      removeFields,
      push,
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
    console.log(method);
    add$.next([...add$.value, method]);
    return returnObjects();
  }

  function removeFields(method: keyof T | any | ((param: T) => [])) {
    pushAndRemove$.next({
      type: "remove",
      remove: method,
      push: pushAndRemove$.value.push,
    });
    return returnObjects();
  }

  function push(obj: T) {
    push$.next([...push$.value, obj]);
  }

  function mutate(find: object, mut: object) {
    mut$.next({ find, mutate: mut });
    return returnObjects();
  }

  let subscribe: Subscription;

  function sub(cb: (data: any) => any) {
    console.log(cb);
    onMounted(() => {
      subscribe = source$.subscribe(cb);
    });
    onUnmounted(() => {
      subscribe.unsubscribe();
    });
  }

  return returnObjects();
}
