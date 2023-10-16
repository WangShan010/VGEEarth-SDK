// 粒子系统参数判断
// 我觉的这种写在SDK里还是挺怪的，应该写在平台里才对，这把plotToll的参数都限定死了，还是中文key


let fireObj = [
    {
        'name': '粒子数量',
        'paramName': 'startScale',
        'min': 0,
        'max': 1000
    },
    {
        'name': '粒子大小',
        'paramName': 'endScale',
        'min': 0,
        'max': 60
    },
    {
        'name': '最小速度',
        'paramName': 'minimumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '最大速度',
        'paramName': 'maximumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '初始比例',
        'paramName': 'particleSize',
        'min': 0,
        'max': 10
    },
    {
        'name': '终止比例',
        'paramName': 'emissionRate',
        'min': 0,
        'max': 10
    },
    {
        'name': '最小生命周期',
        'paramName': 'minimumParticleLife',
        'min': 0.1,
        'max': 5.0
    },
    {
        'name': '最大生命周期',
        'paramName': 'maximumParticleLife',
        'min': 0.1,
        'max': 5.0
    }];
let fountainObj = [
    {
        'name': '粒子数量',
        'paramName': 'startScale',
        'min': 0,
        'max': 1000
    },
    {
        'name': '粒子大小',
        'paramName': 'endScale',
        'min': 0,
        'max': 60
    },
    {
        'name': '最小速度',
        'paramName': 'minimumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '最大速度',
        'paramName': 'maximumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '初始比例',
        'paramName': 'particleSize',
        'min': 0,
        'max': 10
    },
    {
        'name': '终止比例',
        'paramName': 'emissionRate',
        'min': 0,
        'max': 10
    },
    {
        'name': '重力大小',
        'paramName': 'gravity',
        'min': -20,
        'max': 20
    },
    {
        'name': '最小生命周期',
        'paramName': 'minimumParticleLife',
        'min': 0.1,
        'max': 5.0
    },
    {
        'name': '最大生命周期',
        'paramName': 'maximumParticleLife',
        'min': 0.1,
        'max': 5.0
    }];
let smokeObj = [
    {
        'name': '风向'
    }, {
        'name': '粒子数量',
        'paramName': 'startScale',
        'min': 0,
        'max': 1000
    },
    {
        'name': '粒子大小',
        'paramName': 'endScale',
        'min': 0,
        'max': 60
    },
    {
        'name': '最小速度',
        'paramName': 'minimumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '最大速度',
        'paramName': 'maximumSpeed',
        'min': 0,
        'max': 30
    },
    {
        'name': '初始比例',
        'paramName': 'particleSize',
        'min': 0,
        'max': 10
    },
    {
        'name': '终止比例',
        'paramName': 'emissionRate',
        'min': 0,
        'max': 10
    },
    {
        'name': '重力大小',
        'paramName': 'gravity',
        'min': -20,
        'max': 20
    },
    {
        'name': '最小生命周期',
        'paramName': 'minimumParticleLife',
        'min': 0.1,
        'max': 5.0
    },
    {
        'name': '最大生命周期',
        'paramName': 'maximumParticleLife',
        'min': 0.1,
        'max': 5.0
    }];

function particleJudgment(particle: string, paramList: { name: string, value: any }[] = []) {
    let obj: any = {};
    let arr = [];
    if (particle === 'fire') {
        arr = fireObj;
    } else if (particle === 'fountain') {
        arr = fountainObj;
    } else if (particle === 'smoke') {
        arr = smokeObj;
    } else {
        return obj;
    }


    arr.forEach(v => {
        if (v.name === '风向') {
            let paramValue: any = paramList.find(param => param.name === v.name || {})?.value;
            if (paramValue) {
                obj['heading'] = paramValue['heading'];
                obj['pitch'] = paramValue['pitch'];
            }
            return;
        }
        let paramValue = parseFloat((paramList.find(param => param.name === v.name) || {}).value);
        // @ts-ignore
        if (v.min <= paramValue && paramValue <= v.max) {
            // @ts-ignore
            obj[v.paramName] = paramValue;
        }
    });
    return obj;
}

export { particleJudgment };