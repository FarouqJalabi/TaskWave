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
    puts "Yes sir 1234"
    @task = Task.find(params[:id])
    @task.update task_params
    @task.save
    puts "Yes sir 1234", @task
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
