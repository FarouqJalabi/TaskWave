class TasksController < ApplicationController
  def create
    @board = Board.find(params[:board_id])
    @list = @board.lists.find(params[:list_id])
    @task = @list.tasks.create(name: "New task")
    redirect_to board_path(@board)
  end
end
