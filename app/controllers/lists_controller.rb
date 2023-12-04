class ListsController < ApplicationController
  def create
    @board = Board.find(params[:board_id])
    @list = @board.lists.create(list_params)
    redirect_to board_path(@board)
  end

  def update
    @list = List.find(params[:id])
    @list.update(list_params)
    redirect_to board_path(@list.board_id)
  end

  def destroy
    @list = List.find(params[:id])
    board_id = @list.board_id
    @list.destroy
    redirect_to board_path(board_id), status: :see_other
  end
  private
  def list_params
    params.require(:list).permit(:name)
  end
end
