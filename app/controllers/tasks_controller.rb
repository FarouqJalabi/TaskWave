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

    task_order =  params[:tasksOrder].split(",")
    old_task_order =  params[:oldTasksOrder].split(",")

    task_places = Hash[task_order.map.with_index { |id, index| [id.to_i, index] }]
    old_task_places = Hash[old_task_order.map.with_index { |id, index| [id.to_i, index] }]

    combined_task_places = task_places.merge(old_task_places)
    puts combined_task_places

    tasks = Task.where(id: task_order.concat(old_task_order))

    # Bulk update using activeRecord
    tasks.each do |task|
      task.place = combined_task_places[task.id]
    end

    Task.transaction do
      tasks.each(&:save!)
    end

    @task.update task_params
    @task.save
    # For our stimulus
    respond_to do |format|
      format.js
    end
  end

  private

  def task_params
    params.require(:task).permit(:name, :list_id)
  end
end
