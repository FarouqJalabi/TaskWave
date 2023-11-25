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

    if (@task.place != task_params[:place].to_i or  @task.list_id != task_params[:list_id].to_i) and params.has_key?(:taskOrder) and params.has_key?(:oldTasksOrder)
      task_order =  params[:tasksOrder].split(",")
      task_places = Hash[task_order.map.with_index { |id, index| [id.to_i, index] }]
      if @task.list_id != task_params[:list_id].to_i
        old_task_order =  params[:oldTasksOrder].split(",")
        old_task_places = Hash[old_task_order.map.with_index { |id, index| [id.to_i, index] }]
        task_places = task_places.merge(old_task_places)

        task_order = task_order.concat(old_task_order)
      end


      tasks = Task.where(id: task_order)
      update_places(tasks, task_places)
    end




    @task.update task_params
    @task.save
    # For our stimulus
    respond_to do |format|
      format.html do
        redirect_to board_path(@task.list.board)
      end
      format.json do
        render json: {status: 'success'}
      end
    end
  end

  private

  def task_params
    params.require(:task).permit(:name, :list_id)
  end
    def update_places(tasks, combined_task_places)

      # Bulk update using activeRecord
      tasks.each do |task|
        task.place = combined_task_places[task.id]
      end

      Task.transaction do
        tasks.each(&:save!)
      end
    end
end
