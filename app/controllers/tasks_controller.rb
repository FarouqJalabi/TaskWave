class TasksController < ApplicationController
  def create
    # ? Why @ if not sharing with html?
    @board = Board.find(params[:board_id])
    @list = @board.lists.find(params[:list_id]) # ? Faster search using board
    last_task = @list.tasks.order(:place)[-1] # * "Preferable in 99% of cases"
    @task = @list.tasks.create(name: "New task", place: last_task&.place + 1 || 0)
    redirect_to board_path(@board)
  end

  def update
    @task = Task.find(params[:id])
    if @task.place != task_params[:place].to_i or @task.list_id != task_params[:list_id].to_i
      puts "Actual update"
      shift_tasks(List.find[id:task_params[:list_id]] ,@task.list, task_params[:place].to_i)
    end
    # @task.update task_params
    # @task.save
    # For our stimulus
    respond_to do |format|
      format.js
    end
  end

  private
  def shift_old_list(list, place)
    # TODO run through old task and update
  end
  def shift_new_task(old_list, new_list, new_place)
    if new_list.tasks.where(place: new_place)
    # TODO Task.where(place: range).update_all('place = place + ?', direction)
    end
  end

  def task_params
    params.require(:task).permit(:name, :list_id, :place)
  end
end
