import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const TASK = "setup_notification";

TaskManager.defineTask(TASK, ()=>{
  try{
    setInterval(()=>{
      let now = new Date();
      console.log(now);
    },5000);
    const receivedNewData = "TASK:"+Math.random();
    console.log(receivedNewData);
    return receivedNewData? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  }catch(error){
    console.log(error);
    return BackgroundFetch.Result.Failed;
  }
});

const register = async() => {
  const registed = await TaskManager.getRegisteredTasksAsync();
  await BackgroundFetch.setMinimumIntervalAsync(1);
  console.log(registed);
  return await BackgroundFetch.registerTaskAsync( TASK, {
    minimumInterval: 1,
    stopOnTerminate: false,
  });
}

const unregister = async() => {
  const registed = await TaskManager.getRegisteredTasksAsync();
  console.log(registed);
  return await BackgroundFetch.unregisterTaskAsync( TASK )
}

export default {
  register,
  unregister,
}