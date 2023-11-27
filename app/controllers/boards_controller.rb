class BoardsController < ApplicationController

  before_action :set_board, only: [:show]
  before_action :authenticate_user!, only: [:create, :new]
  def index

    @user_boards = Board.where(creator_id:current_user)
    @other_boards = Board.where(public: true).where.not(creator_id:current_user)
  end
  def show
  end

  def new
    @board = Board.new
  end

  def create
      @board = current_user.boards.new(board_params)
      if @board.save
        redirect_to board_path(@board)
      elsif
        render :new, status: :unprocessable_entity
      end
  end
  def update
    @board = Board.find(params[:id])
    @board.update(board_params)
    redirect_to @board
  end
  private
  def set_board
    @board = Board.find(params[:id])
  end
  def board_params
    params.require(:board).permit(:name, :public)
  end
end
