class TasksController < ApplicationController
  def create
    # ? Why @ if not sharing with html?
    @board = Board.find(params[:board_id])
    @list = @board.lists.find(params[:list_id]) # ? Faster search using board
    last_task = @list.tasks.order(:place)[-1] # * "Preferable in 99% of cases"
    @task = @list.tasks.create(name: task_params[:name], place: last_task&.place + 1 || 0)
    redirect_to board_path(@board)
  end

  def update
    @task = Task.find(params[:id])
    old_task_place = @task.place
    old_list_id = @task.list_id
    @task.update task_params
    @task.save
    if old_task_place != @task.place or old_list_id != @task.list_id
      # Only stimulus updates place
      # Actually needs updating
      task_order =  params[:tasksOrder].split(",")
      conditions = task_order.map { |id| "WHEN #{id} THEN #{task_order.index(id)}" }.join(' ')
      Task.where(id: task_order).update_all(["place = CASE id #{conditions} END"])

      respond_to do |format|
        format.json
      end
    elsif
      # If not stimulus must be rails form
      redirect_to board_path(@task.list.board)
    end
  end

  private

  def task_params
    params.require(:task).permit(:name, :list_id)
  end
end