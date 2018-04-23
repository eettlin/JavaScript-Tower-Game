
class Wave {

  constructor(game,waveJson) {
    this.game=game;
    this.waveJson=waveJson;
    this.enemyId=[0,0];
    this.referenceTime=this.game.gameTime+this.waveJson.waveIncrement;
    this.spawnOver=false;
  }

  run() {

      while(this.game.gameTime>this.referenceTime && !this.spawnOver){
        if(this.enemyId[0]<this.waveJson.packets.length){
          if(this.enemyId[1]<this.waveJson.packets[this.enemyId[0]].num){
            this.game.enemies.push(this.enemySelector(this.game,this.waveJson.packets[this.enemyId[0]].enemy))
            this.referenceTime+=this.waveJson.packets[this.enemyId[0]].enemyIncrement
            this.enemyId[1]+=1
          }else{
            this.referenceTime+=this.waveJson.packets[this.enemyId[0]].packetIncrement
            this.enemyId[1]=0
            this.enemyId[0]+=1
          }
        }else{
          this.spawnOver=true
          break
        }
      }

  }
  isWaveOver() {
    if(!this.game.enemies[0] && this.spawnOver){
      return true
    }else{
      return false
    }
  }
    //parses JSON
    enemySelector(game,enemyJSON) {
       // if we found a valid cell to start the enemy
        //create an array of the arguments for the enemy class
        var args=[null,game].concat(enemyJSON.additionalEnemyArguments)
        //apply the argument array to the specified enemy class
        var tempEnemy= enemyJSON.enemy.bind.apply(enemyJSON.enemy,args)
        return new tempEnemy

    }
}
//so yeah,theres stuff here
//AllWaves is an array of waves. each wave has a name and a wave increment. the wave increment is the amount of time before a wave begins.
//waves are seperated into packets. each packet specifies the enemy type, enemy increment, packet increment, and number of enemies.
//enemyIncrement is amount of time between two enemy spawns. if enemy increment is less than 1, multiple enemies will spawn at the same time.
//packetIncrement is the amount of time that must pass before the next packet can begin.
//num is the number of enemies that will be spawned before the packet is over
//enemy is a JSON object that specifes the exact type of enemy to be spawned and is parsed by the enemySelector function
//enemy contains enemy, enemyPosition, and additionalEnemyArguments.
//enemy within enemy specifies the enemy class to be called
//enemyPosition is a 2d array that spefies the area in whicch an enemt will be randomly spawned
//the numbers are formated as fractions of the total grid with the smaller number coming first
//additionalEnemyArguments specifies any additional arguments that might be added to an enemy class
AllWaves=[
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":15,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"wave1",
    "waveIncrement":20
  },
  {
    "packets":[
      {
        "enemy":{
          "enemy":Enemy1,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":10,
        "enemyIncrement":.25,
        "packetIncrement":2
      },
      {
        "enemy":{
          "enemy":Enemy3,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            0
          ]
        },
        "num":3,
        "enemyIncrement":.75,
        "packetIncrement":1
      }
    ],
    "name":"wave2",
    "waveIncrement":10
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":5,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"wave3",
    "waveIncrement":10
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":5,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"wave4",
    "waveIncrement":6
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":5,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"wave5",
    "waveIncrement":6
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":5,
        "enemyIncrement":1,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"wave6",
    "waveIncrement":6
  },
  {
    "packets":[
      {
        "enemy":{
          "enemy":Enemy1,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":1,
        "enemyIncrement":.01,
        "packetIncrement":.01
      },
      {
        "enemy":{
          "enemy":Enemy2,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":1,
        "enemyIncrement":.01,
        "packetIncrement":.01
      },
      {
        "enemy":{
          "enemy":Enemy3,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":1,
        "enemyIncrement":.01,
        "packetIncrement":.01
      },
      {
        "enemy":{
          "enemy":Enemy4,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":1,
        "enemyIncrement":.01,
        "packetIncrement":.01
      },
      {
        "enemy":{
          "enemy":Enemy5,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            0
          ]
        },
        "num":1,
        "enemyIncrement":.01,
        "packetIncrement":.01
      }
    ],
    "name":"all the enemies",
    "waveIncrement":6
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":600,
        "enemyIncrement":.03*5,
        "packetIncrement":3
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":100,
        "enemyIncrement":.05,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":100,
        "enemyIncrement":.1,
        "packetIncrement":1
      }
    ],
    "name":"AAAAAHHHHHHH",
    "waveIncrement":6
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy4,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":120,
        "enemyIncrement":.05,
        "packetIncrement":3
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy5,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":60,
        "enemyIncrement":.025,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":70,
        "enemyIncrement":.2,
        "packetIncrement":1
      }
    ],
    "name":"Io0K aT tHe5E",
    "waveIncrement":0
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":6660,
        "enemyIncrement":.006,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":660,
        "enemyIncrement":.06,
        "packetIncrement":2
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":60,
        "enemyIncrement":.6,
        "packetIncrement":3
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy2,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":660,
        "enemyIncrement":.06,
        "packetIncrement":2
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":6660,
        "enemyIncrement":.006,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":66660,
        "enemyIncrement":.006,
        "packetIncrement":1
      }
    ],
    "name":"SATAN'S LEVEL",
    "waveIncrement":0
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy1,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1,
        "enemyIncrement":10,
        "packetIncrement":10
      }
    ],
    "name":"super hard level",
    "waveIncrement":10
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy4,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":500,
        "enemyIncrement":.07,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":500,
        "enemyIncrement":.07,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy4,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1000,
        "enemyIncrement":.005,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy3,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1000,
        "enemyIncrement":.005,
        "packetIncrement":1
      },
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy4,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":2000,
        "enemyIncrement":.003,
        "packetIncrement":1
      }
    ],
    "name":"8",
    "waveIncrement":7
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy5,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":100000,
        "enemyIncrement":.001,
        "packetIncrement":0
      }
    ],
    "name":"lol?",
    "waveIncrement":2
  },
  {
    "packets":[
      {
        "enemy":{//this specifies the information about the enemy
          "enemy":Enemy5,
          "additionalEnemyArguments":[//
            1
          ]
        },
        "num":1000000,
        "enemyIncrement":.0001,
        "packetIncrement":0
      }
    ],
    "name":"lol.",
    "waveIncrement":2
  },
  {
    "packets":[
      {
        "enemy":{
          "enemy":Enemy5,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,1
            ]
          ],
          "additionalEnemyArguments":[
            1
          ]
        },
        "num":Infinity,
        "enemyIncrement":.000001,
        "packetIncrement":1
      },
      {
        "enemy":{
          "enemy":Enemy,
          "enemyPosition":[
            [
              0,1
            ],
            [
              0,.5
            ]
          ],
          "additionalEnemyArguments":[
            0
          ]
        },
        "num":10,
        "enemyIncrement":1,
        "packetIncrement":1
      }
    ],
    "name":"infinite wave",
    "waveIncrement":30,
    "info":"this wave should always be the last wave"
  }
]
