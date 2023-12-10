class TasksController < ApplicationController
  before_action :authorize_user!
  before_action :set_task, only: [:update, :destroy ]
  def create
    # ? Why @ if not sharing with html?
    @board = Board.find(params[:board_id])
    @list = @board.lists.find(params[:list_id]) # ? Faster search using board
    last_task = @list.tasks.order(:place)[-1] # * "Preferable in 99% of cases"

    @task = @list.tasks.create(name: task_params[:name], place: last_task&.place.to_i + 1)
    redirect_to board_path(@board)
  end

  def update
    old_task_place = @task.place
    old_list_id = @task.list_id
    @task.update task_params
    @task.save
    if old_list_id != @task.list_id or params[:tasksOrder]
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
    render board_path(@task.list.board)
    end
  end

  def destroy
    board_id = @task.list.board_id
    @task.destroy
    redirect_to board_path(board_id), status: :see_other
  end

  private
  def set_task
     @task = Task.find(params[:id])
   end
  def task_params
    params.require(:task).permit(:name, :list_id)
  end
  def authorize_user!
    authenticate_user!
    @board = Board.find(params[:board_id])
    unless @board.creator == current_user
      render "boards/show", status: :unauthorized
    end
  end
end