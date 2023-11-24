class TasksController < ApplicationController
  def create
    # ? Why find board if we have list_id
    @board = Board.find(params[:board_id])
    @list = @board.lists.find(params[:list_id])
    @task = @list.tasks.create(name: "New task")
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
