import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject, from, interval, of, take, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  filter,
  map,
  mergeMap,
  scan,
  switchMap,
  timeout,
  toArray,
} from 'rxjs/operators';

// ------  Pokemon models ------ //
interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResponse[];
}

interface PokemonResponse {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: PokemonAbilityResponse[];
  forms: [];
  stats: [];
  [key: string]: any;
}

// ------  Ability models ------ //
interface PokemonAbilityResponse {
  ability: PokemonAbility;
  is_hidden: boolean;
  slot: number;
}

interface PokemonAbility {
  name: string;
  url: string;
}

// ------  Stat models ------ //
interface PokemonStatResponse {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokemonStatResult {
  name: string;
  base_stat: number;
}

@Component({
  selector: 'app-rxjs-page',
  templateUrl: './rxjs-page.component.html',
  styleUrls: ['./rxjs-page.component.scss'],
})
export class RxjsPageComponent {
  private baseApiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Получение 3 высоких но нетяжелых покемонов :)
  getPokemonStart1(): Observable<Pokemon> {
    return this.http.get<ApiResponse>(`${this.baseApiUrl}/pokemon/`).pipe(
      map((response) => {
        // console.log('1. map', response);
        return response.results;
      }),
      mergeMap((pokemonList: PokemonResponse[]) => {
        // console.log('2. mergeMap', pokemonList);
        return pokemonList;
      }),
      mergeMap((pokemon: PokemonResponse) => {
        // console.log('3. mergeMap', pokemon);
        return this.getPokemonDataByUrl(pokemon.url, [
          'name',
          'height',
          'weight',
        ]);
      }),
      filter((pokemon: Pokemon) => {
        // console.log('4. filter', pokemon);
        return pokemon.height > 10 && pokemon.weight < 500;
      }),
      take(3)
    );
  }

  // Получение потока нескрытых способностей покемона "pokemonName"
  getPokemonStart2(pokemonName: string): Observable<string> {
    return this.http
      .get<Pokemon>(`${this.baseApiUrl}/pokemon/${pokemonName}`)
      .pipe(
        map((response: Pokemon) => {
          // console.log('1. map', response);
          return response.abilities;
        }),
        switchMap((pokemonAbilityList: PokemonAbilityResponse[]) => {
          // console.log('2. switchMap', pokemonAbilityList);
          return from(pokemonAbilityList);
        }),
        filter((abilities: PokemonAbilityResponse) => {
          // console.log('3. filter', abilities);
          return !abilities.is_hidden;
        }),
        map((ability: PokemonAbilityResponse) => {
          // console.log('4. map', ability);
          return ability.ability.name;
        }),
        timeout(1000),
        catchError((error) => {
          console.log('Произошла ошибка:', error);
          return throwError('Ошибка при получении данных');
        })
      );
  }

  // Получение характеристи первого покемона в массиве
  getPokemonStart3(pokemonNameList: string[]): Observable<PokemonStatResult> {
    return from(pokemonNameList).pipe(
      exhaustMap((name: string) => {
        // console.log('1. exhaustMap', name);
        return from(this.getPokemonData(name));
      }),
      mergeMap((pokemonData: Pokemon) => {
        // console.log('2. mergeMap', pokemonData);

        const stats = from(pokemonData.stats);

        return stats.pipe(
          map((stat: PokemonStatResponse) => {
            // console.log('4. map', stat);
            const resultStat: PokemonStatResult = {
              name: stat.stat.name,
              base_stat: stat.base_stat,
            };
            return resultStat;
          })
        );
      })
    );
  }

  // получение переданных свойств ( массив properties ) покемона по переданному url
  getPokemonDataByUrl(url: string, properties: string[]): Observable<Pokemon> {
    return this.http.get<Pokemon>(url).pipe(
      map((pokemonData: Pokemon) => {
        // console.log(pokemonData)
        return properties.reduce((pokemon: Pokemon, property: string) => {
          if (pokemonData.hasOwnProperty(property)) {
            pokemon[property] = pokemonData[property];
          }
          return pokemon;
        }, {} as Pokemon);
      })
    );
  }

  // получение переданных данных ( массив properties ) покемона по переданному url
  getPokemonData(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseApiUrl}/pokemon/${name}`);
  }

  // получить промис с таймаутом, в колбеке которого вычисляется сумма элементом массива
  sumArrayWithDelay(array: number[], delay: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sum = array.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        resolve(sum);
      }, delay);
    });
  }

  start1() {
    this.getPokemonStart1().subscribe((pokemon) =>
      console.log('Покемон ростом выше 10 и весом меньше 500', pokemon)
    );
  }

  start2() {
    const pokemonName = 'snorlax';

    this.getPokemonStart2(pokemonName).subscribe(
      (abilityName: string) => {
        console.log(`${pokemonName} имеет способность: ${abilityName}`);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  start3() {
    const pokemonSubject = new Subject<PokemonStatResult>();

    this.getPokemonStart3(['pikachu', 'metapod', 'drifloon']).subscribe(
      (pokemonStatResult) => {
        pokemonSubject.next(pokemonStatResult);
      },
      (error) => {
        pokemonSubject.error(error);
      },
      () => {
        pokemonSubject.complete();
      }
    );

    pokemonSubject.subscribe(
      (pokemonStatResult) => {
        console.log(
          'Характеристика покемона:',
          pokemonStatResult.name,
          pokemonStatResult.base_stat
        );
      },
      (error) => {
        console.error(error);
      },
      () => {
        console.log('Subject завершен');
      }
    );
  }

  start4() {
    const array = [10, 2, 1, 4]; // = 17

    this.sumArrayWithDelay(array, 2000)
      .then((sum) => console.log('Сумма элементов массива:', sum))
      .catch((error) => console.error('Ошибка:', error));
  }
}
