import UserHandler from "./handler";
import UserRepository from "./repository";
import { Router } from "express";
interface UserHandlerInstance extends UserHandler {}
interface UserRepositoryInstance extends UserRepository {}
interface RouterInstance extends Router {}